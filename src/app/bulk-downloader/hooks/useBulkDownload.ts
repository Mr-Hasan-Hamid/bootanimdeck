import { useState, useRef } from "react";
import JSZip from "jszip";
import { resizeBootAnimation } from "@/utils/resizeZip";

interface MinimialAnimationItem {
  name: string;
  zipName: string;
  zipUrl: string;
}

export function useBulkDownload() {
  const [downloading, setDownloading] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [downloadErrors, setDownloadErrors] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleCancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setDownloading(false);
    setProgressPercent(0);
    setStatusText("Download cancelled by user.");
  };

  const handleDownloadBulk = async (
    selectedAnimations: MinimialAnimationItem[],
    targetWidth?: number,
    targetHeight?: number
  ) => {
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

    const queue = [...selectedAnimations];
    const totalCount = selectedAnimations.length;

    const worker = async () => {
      while (queue.length > 0 && !signal.aborted) {
        const item = queue.shift();
        if (!item) continue;

        try {
          setStatusText(`Fetching: ${item.name} (${completedCount + 1}/${totalCount})`);

          // Fetch using our same-origin API proxy to avoid browser CORS blocks
          const proxyUrl = `/api/download?url=${encodeURIComponent(item.zipUrl)}`;
          const response = await fetch(proxyUrl, { signal });
          if (!response.ok) throw new Error(`HTTP status ${response.status}`);

          let arrayBuffer = await response.arrayBuffer();

          if (targetWidth && targetHeight) {
            try {
              arrayBuffer = await resizeBootAnimation(arrayBuffer, targetWidth, targetHeight);
            } catch (resizeErr) {
              console.warn(`Failed to resize ${item.name} in bulk download:`, resizeErr);
            }
          }

          zip.file(item.zipName, arrayBuffer);

          completedCount++;
          setProgressPercent(Math.round((completedCount / totalCount) * 80));
        } catch (error) {
          const err = error as Error;
          if (err.name === "AbortError") {
            throw err;
          }
          console.error(`Error downloading ${item.name}:`, err);
          errorsList.push(`${item.name} (Error: ${err.message || String(err)})`);
          completedCount++;
        }
      }
    };

    try {
      const workers = Array.from({ length: Math.min(concurrencyLimit, totalCount) }, () => worker());
      await Promise.all(workers);

      if (signal.aborted) return;

      if (errorsList.length === totalCount) {
        throw new Error("All file transfers failed. Please check your internet connection.");
      }

      setDownloadErrors(errorsList);
      setStatusText(
        "Compiling master ZIP archive... this might take a moment depending on package size."
      );

      const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
        if (!signal.aborted) {
          setProgressPercent(80 + Math.round(metadata.percent * 0.2));
        }
      });

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

  return {
    downloading,
    progressPercent,
    statusText,
    downloadErrors,
    handleDownloadBulk,
    handleCancelDownload,
    setDownloadErrors,
  };
}
