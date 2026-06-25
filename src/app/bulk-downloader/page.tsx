"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import HoverPreview from "@/components/HoverPreview";
import animationsData from "../../data/animations.json";
import ShimmerButton from "@/components/ShimmerButton";
import JSZip from "jszip";

interface Part {
  type: string;
  loopCount: number;
  pause: number;
  folder: string;
}

interface AnimationItem {
  id: string;
  folderName: string;
  name: string;
  width: number;
  height: number;
  fps: number;
  parts: Part[];
  sizeBytes: number;
  sizeFormatted: string;
  zipName: string;
  zipUrl: string;
  gifUrl: string | null;
  coverUrl: string | null;
}

export default function BulkDownloaderPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Download state variables
  const [downloading, setDownloading] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [downloadErrors, setDownloadErrors] = useState<string[]>([]);

  // Ref to cancel ongoing downloads
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Categorization mapping
  const categorise = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes("google") || n.includes("pixel")) return "Google";
    if (
      n.includes("rog") ||
      n.includes("alienware") ||
      n.includes("apple") ||
      n.includes("samsung") ||
      n.includes("xbox") ||
      n.includes("playstation") ||
      n.includes("psx") ||
      n.includes("overwatch") ||
      n.includes("ibm") ||
      n.includes("zelda") ||
      n.includes("watch dogs") ||
      n.includes("darth")
    )
      return "Brand & Gaming";
    if (
      n.includes("hud") ||
      n.includes("circuit") ||
      n.includes("digital") ||
      n.includes("glitch") ||
      n.includes("tech") ||
      n.includes("alien") ||
      n.includes("cyber") ||
      n.includes("matrix")
    )
      return "Sci-Fi & Tech";
    if (
      n.includes("load") ||
      n.includes("dots") ||
      n.includes("line") ||
      n.includes("point") ||
      n.includes("bubble") ||
      n.includes("preloader")
    )
      return "Minimalist";
    return "Abstract";
  };

  // Process and group list
  const processedAnimations = useMemo(() => {
    let list = (animationsData as AnimationItem[]).map((item) => ({
      ...item,
      category: categorise(item.name),
    }));

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.folderName.toLowerCase().includes(q) ||
          `${item.width}x${item.height}`.includes(q)
      );
    }

    if (activeCategory !== "All") {
      list = list.filter((item) => item.category === activeCategory);
    }

    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [search, activeCategory]);

  const categories = ["All", "Google", "Brand & Gaming", "Sci-Fi & Tech", "Minimalist", "Abstract"];

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllMatching = () => {
    const matchingIds = processedAnimations.map((anim) => anim.id);
    setSelectedIds((prev) => {
      // Create a set of unique IDs combining existing ones and matching ones
      const unique = new Set([...prev, ...matchingIds]);
      return Array.from(unique);
    });
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleInvertSelection = () => {
    const matchingIds = processedAnimations.map((anim) => anim.id);
    setSelectedIds((prev) => {
      const currentSet = new Set(prev);
      const inverted = matchingIds.filter((id) => !currentSet.has(id));
      // Keep any currently selected animations that are NOT in the active matching list
      const nonMatchingActive = prev.filter((id) => !matchingIds.includes(id));
      return [...nonMatchingActive, ...inverted];
    });
  };

  // Size calculation helper
  const selectedAnimations = useMemo(() => {
    const itemsMap = new Map((animationsData as AnimationItem[]).map((a) => [a.id, a]));
    return selectedIds.map((id) => itemsMap.get(id)).filter((item): item is AnimationItem => !!item);
  }, [selectedIds]);

  const totalBytes = useMemo(() => {
    return selectedAnimations.reduce((sum, item) => sum + item.sizeBytes, 0);
  }, [selectedAnimations]);

  const totalSizeFormatted = useMemo(() => {
    if (totalBytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(totalBytes) / Math.log(k));
    return parseFloat((totalBytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, [totalBytes]);

  const handleCancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setDownloading(false);
    setProgressPercent(0);
    setStatusText("Download cancelled by user.");
  };

  // Core Bulk Download Generator Logic
  const handleDownloadBulk = async () => {
    if (selectedAnimations.length === 0) return;

    setDownloading(true);
    setProgressPercent(0);
    setStatusText("Initializing package workspace...");
    setDownloadErrors([]);

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const zip = new JSZip();
    const concurrencyLimit = 5;
    let completedCount = 0;
    const errorsList: string[] = [];

    // Parallel fetch with concurrency limit
    const queue = [...selectedAnimations];
    const totalCount = selectedAnimations.length;

    const worker = async () => {
      while (queue.length > 0 && !signal.aborted) {
        const item = queue.shift();
        if (!item) continue;

        try {
          setStatusText(`Fetching: ${item.name} (${completedCount + 1}/${totalCount})`);
          
          const response = await fetch(item.zipUrl, { signal });
          if (!response.ok) throw new Error(`HTTP status ${response.status}`);
          
          const arrayBuffer = await response.arrayBuffer();
          zip.file(item.zipName, arrayBuffer);
          
          completedCount++;
          setProgressPercent(Math.round((completedCount / totalCount) * 80)); // Fetch represents 80% of progress
        } catch (error) {
          const err = error as Error;
          if (err.name === "AbortError") {
            throw err;
          }
          console.error(`Error downloading ${item.name}:`, err);
          errorsList.push(`${item.name} (Error: ${err.message || String(err)})`);
          completedCount++; // still count to progress to prevent locks
        }
      }
    };

    try {
      // Spawn workers
      const workers = Array.from({ length: Math.min(concurrencyLimit, totalCount) }, () => worker());
      await Promise.all(workers);

      if (signal.aborted) return;

      if (errorsList.length === totalCount) {
        throw new Error("All file transfers failed. Please check your internet connection.");
      }

      setDownloadErrors(errorsList);

      // Package zip client side (20% of progress)
      setStatusText("Compiling master ZIP archive... this might take a moment depending on package size.");
      
      const content = await zip.generateAsync(
        { type: "blob" },
        (metadata) => {
          if (!signal.aborted) {
            setProgressPercent(80 + Math.round(metadata.percent * 0.2));
          }
        }
      );

      if (signal.aborted) return;

      setStatusText("Saving package archive to downloads...");
      
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `bootanimdeck-package-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStatusText(
        errorsList.length > 0 
          ? `Package saved! (${totalCount - errorsList.length} of ${totalCount} successful. Click Clear to restart.)` 
          : "🎉 All animations compiled and saved successfully!"
      );
    } catch (error) {
      const err = error as Error;
      if (err.name === "AbortError") {
        setStatusText("Transfer aborted.");
      } else {
        console.error("Zipping error:", err);
        setStatusText(`❌ Error assembling package: ${err.message || String(err)}`);
      }
    } finally {
      if (!signal.aborted) {
        setDownloading(false);
      }
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="fade-in bg-white dark:bg-black text-black dark:text-white min-h-screen">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-neutral-50 dark:bg-black border-b border-neutral-200 dark:border-neutral-900 py-12 md:py-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-neutral-450 uppercase mb-4">
            <Link href="/" className="hover:text-cyan-500 transition-colors">Gallery</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">Bulk Downloader</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 text-gradient">
            Bulk Downloader
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl text-xs md:text-sm leading-relaxed">
            Select, package, and download multiple flashable boot sequences simultaneously. Downloads are fetched from the CDN and zipped 100% inside your browser safely.
          </p>
        </div>
      </section>

      {/* Control Panel and Grid */}
      <section className="mx-auto max-w-7xl px-6 py-10 pb-36">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-stretch md:items-center">
          {/* Search bar */}
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              placeholder="Filter by name or resolution..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-600 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800 dark:hover:text-white font-mono text-[10px]"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSelectAllMatching}
              className="px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              Select All Matching ({processedAnimations.length})
            </button>
            <button
              onClick={handleInvertSelection}
              className="px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              Invert Selection
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-red-500 hover:text-red-650 text-[10px] font-bold uppercase tracking-wider transition-colors"
              >
                Clear Selection ({selectedIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Category switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-neutral-100 dark:border-neutral-900 scrollbar-none">
          {categories.map((cat) => (
            <ShimmerButton
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </ShimmerButton>
          ))}
        </div>

        {/* Grid display */}
        {!mounted ? (
          <div className="card-grid">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={`ske-${idx}`} className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-2xl overflow-hidden aspect-[4/3.5] animate-pulse" />
            ))}
          </div>
        ) : processedAnimations.length > 0 ? (
          <div className="card-grid">
            {processedAnimations.map((anim) => {
              const isChecked = selectedIds.includes(anim.id);
              return (
                <div
                  key={anim.id}
                  onClick={() => handleToggleSelect(anim.id)}
                  className={`anim-card group cursor-pointer border rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 ${
                    isChecked
                      ? "border-cyan-500 bg-cyan-50/5 dark:bg-cyan-950/10 shadow-lg"
                      : "border-neutral-200 dark:border-neutral-900 bg-neutral-55 dark:bg-neutral-950"
                  }`}
                >
                  {/* Media area */}
                  <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center border-b border-neutral-200 dark:border-neutral-900">
                    {anim.gifUrl ? (
                      <HoverPreview gifUrl={anim.gifUrl} coverUrl={anim.coverUrl} alt={anim.name} />
                    ) : (
                      <div className="text-xs text-neutral-600 font-mono">No Preview</div>
                    )}
                    
                    {/* Resolution badge */}
                    <div className="absolute top-3 left-3 bg-neutral-100/90 dark:bg-black/80 backdrop-blur border border-neutral-200 dark:border-neutral-800 text-[9px] font-mono px-2 py-0.5 rounded text-neutral-500 dark:text-neutral-400 pointer-events-none">
                      {anim.width} × {anim.height}
                    </div>

                    {/* Checkbox overlay */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className={`h-6 w-6 rounded-lg flex items-center justify-center border transition-all duration-200 backdrop-blur ${
                        isChecked
                          ? "bg-cyan-500 border-cyan-500 text-white shadow-md shadow-cyan-500/20 scale-105"
                          : "border-neutral-300 dark:border-neutral-700 bg-black/40 text-transparent"
                      }`}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Info block */}
                  <div className="p-4 flex flex-col justify-between flex-grow font-mono text-xs select-none">
                    <div>
                      <h3 className={`text-xs font-bold tracking-tight line-clamp-1 transition-colors flex items-center gap-1.5 ${
                        isChecked ? "text-cyan-500" : "text-neutral-900 dark:text-neutral-100"
                      }`}>
                        <span className="text-cyan-500 font-extrabold">&gt;</span>
                        <span>{anim.name}</span>
                      </h3>
                      <div className="mt-2 text-[9px] text-neutral-500 dark:text-neutral-455">
                        <span className="truncate block" title={anim.zipName}>{anim.zipName}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-900/60 text-[9px] text-neutral-450">
                      <div>
                        <span>fps: </span>
                        <span className="text-neutral-800 dark:text-neutral-300 font-bold">{anim.fps}</span>
                      </div>
                      <div>
                        <span>size: </span>
                        <span className="text-neutral-800 dark:text-neutral-300 font-bold">{anim.sizeFormatted}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
            <p className="text-xs text-neutral-400 font-mono">No matching boot animations found.</p>
          </div>
        )}
      </section>

      {/* Floating Bottom Status Bar Panel */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/90 dark:bg-black/95 border-t border-neutral-850 backdrop-blur-md px-6 py-5 shadow-2xl transition-all duration-300 slide-in-bottom">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            {/* Status Information */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-6 text-center sm:text-left">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block tracking-wider">Animations Selected</span>
                <span className="text-sm font-bold text-white">
                  {selectedIds.length} <span className="text-neutral-500">/ {animationsData.length}</span>
                </span>
              </div>
              <div className="hidden sm:block h-8 w-px bg-neutral-800 self-center" />
              <div>
                <span className="text-[10px] text-neutral-500 uppercase block tracking-wider">Estimated Package Size</span>
                <span className="text-sm font-bold text-cyan-400">{totalSizeFormatted}</span>
              </div>
            </div>

            {/* Action Bar / Progress Monitor */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {downloading ? (
                <div className="flex items-center gap-4 w-full sm:w-80">
                  <div className="flex-grow">
                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1 leading-none">
                      <span className="truncate max-w-[180px]" title={statusText}>{statusText}</span>
                      <span className="font-bold text-cyan-400">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-neutral-850 h-2 rounded-full overflow-hidden border border-neutral-800">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCancelDownload}
                    className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-850 text-red-500 hover:bg-neutral-800 hover:text-red-450 transition-colors shrink-0 text-[10px] font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleClearSelection}
                    className="px-4 py-3 rounded-xl border border-neutral-800 hover:bg-neutral-800 text-[11px] text-neutral-400 font-bold uppercase tracking-wider transition-colors w-1/3 sm:w-auto"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleDownloadBulk}
                    className="flex-grow sm:flex-grow-0 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-[11px] uppercase tracking-widest transition-all duration-300 shadow-md shadow-cyan-500/20 active:scale-98 animate-pulse hover:animate-none flex items-center justify-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download Package (.zip)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error notifications */}
          {downloadErrors.length > 0 && (
            <div className="mx-auto max-w-7xl mt-3 p-3 bg-red-950/40 border border-red-900/60 rounded-lg text-[9px] font-mono text-red-400 space-y-1 max-h-16 overflow-y-auto">
              <span className="font-bold block uppercase tracking-wide">Warning: The following files failed to download and were excluded from the archive:</span>
              {downloadErrors.map((err, i) => (
                <div key={i}>• {err}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
