"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import JSZip from "jszip";
import Link from "next/link";
import CustomDropdown from "@/components/CustomDropdown";

// Dropdown options configurations
const PRESET_OPTIONS = [
  { value: "fhd-plus", label: "1080 × 2400 (FHD+ 20:9)" },
  { value: "fhd", label: "1080 × 1920 (FHD 16:9)" },
  { value: "hd", label: "720 × 1280 (HD 16:9)" },
  { value: "custom", label: "Custom Dimensions" },
];

const RESIZE_OPTIONS = [
  { value: "cover", label: "Cover (Fill Screen & Crop)" },
  { value: "contain", label: "Contain (Fit with borders)" },
];

const FPS_OPTIONS = [
  { value: 15, label: "15 FPS (Lightweight)" },
  { value: 24, label: "24 FPS" },
  { value: 30, label: "30 FPS (Standard)" },
  { value: 60, label: "60 FPS (Ultra Smooth)" },
];

const LOOP_OPTIONS = [
  { value: 0, label: "Infinite Loops" },
  { value: 1, label: "Play Once" },
];

const SCALE_OPTIONS = [
  { value: 1.0, label: "1.0 (Full Size)" },
  { value: 0.8, label: "0.8 (Highly Optimized)" },
  { value: 0.6, label: "0.6 (Super Small ZIP)" },
  { value: 0.5, label: "0.5 (Maximum Saver)" },
];

export default function VideoToZipPage() {
  // Video & Conversion State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [duration, setDuration] = useState(0);

  // Settings State
  const [resPreset, setResPreset] = useState("fhd-plus");
  const [convWidth, setConvWidth] = useState(1080);
  const [convHeight, setConvHeight] = useState(2400);
  const [convFps, setConvFps] = useState(30);
  const [convLoop, setConvLoop] = useState(0); // 0 = Infinite, 1 = Once
  const [resizeMode, setResizeMode] = useState<"cover" | "contain">("cover");
  const [scaleQuality, setScaleQuality] = useState(1.0); // Output downsampling scale (0.5 to 1.0)
  const [bgColor, setBgColor] = useState("#000000");
  const [customPartName, setCustomPartName] = useState("part0");

  // Trim States
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  // Compile Progress States
  const [convStatus, setConvStatus] = useState<"idle" | "rendering" | "compiling" | "done" | "error">("idle");
  const [convProgress, setConvProgress] = useState(0);
  const [convCurrentFrame, setConvCurrentFrame] = useState(0);
  const [convTotalFrames, setConvTotalFrames] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  // Handle Video select
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setConvStatus("idle");
    setConvProgress(0);
    setTrimStart(0);
  };

  const handleVideoLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
      setTrimEnd(video.duration);
    }
  };

  const handlePresetChange = (val: string) => {
    setResPreset(val);
    if (val === "fhd-plus") {
      setConvWidth(1080);
      setConvHeight(2400);
    } else if (val === "fhd") {
      setConvWidth(1080);
      setConvHeight(1920);
    } else if (val === "hd") {
      setConvWidth(720);
      setConvHeight(1280);
    }
  };

  // Convert Video to frames and compile ZIP
  const processVideoToBootanim = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !videoFile) {
      alert("Please select a video file first.");
      return;
    }

    setConvStatus("rendering");
    setConvProgress(0);

    const interval = 1 / convFps;
    const startPoint = Math.max(0, trimStart);
    const endPoint = Math.min(trimEnd, duration);
    const totalFrames = Math.max(1, Math.floor((endPoint - startPoint) * convFps));
    
    setConvTotalFrames(totalFrames);
    setConvCurrentFrame(0);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setConvStatus("error");
      return;
    }

    const zip = new JSZip();
    let frameIndex = 0;
    let time = startPoint;

    // Helper canvas to export scaled images
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = convWidth * scaleQuality;
    tempCanvas.height = convHeight * scaleQuality;
    const tempCtx = tempCanvas.getContext("2d");

    const captureNextFrame = async (): Promise<void> => {
      if (time >= endPoint || frameIndex >= totalFrames) {
        setConvStatus("compiling");

        let descContent = `${convWidth} ${convHeight} ${convFps}\n`;
        descContent += `p ${convLoop} 0 ${customPartName}\n`;
        zip.file("desc.txt", descContent);

        try {
          const zipBlob = await zip.generateAsync({
            type: "blob",
            compression: "STORE", // Crucial for Android Bootloaders
          });

          const downloadUrl = URL.createObjectURL(zipBlob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          const cleanName = videoFile.name.substring(0, videoFile.name.lastIndexOf('.')) || "custom";
          a.download = `${cleanName}_bootanimation.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);

          setConvStatus("done");
          setConvProgress(100);
        } catch (e) {
          console.error("ZIP packaging failed:", e);
          setConvStatus("error");
        }
        return;
      }

      video.currentTime = time;

      return new Promise<void>((resolve) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);

          // Clear canvas with background color
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, convWidth, convHeight);

          const videoRatio = video.videoWidth / video.videoHeight;
          const canvasRatio = convWidth / convHeight;
          let drawWidth = convWidth;
          let drawHeight = convHeight;
          let drawX = 0;
          let drawY = 0;

          if (resizeMode === "contain") {
            if (videoRatio > canvasRatio) {
              drawHeight = convWidth / videoRatio;
              drawY = (convHeight - drawHeight) / 2;
            } else {
              drawWidth = convHeight * videoRatio;
              drawX = (convWidth - drawWidth) / 2;
            }
          } else {
            // cover mode: Fill and crop excess
            if (videoRatio > canvasRatio) {
              drawWidth = convHeight * videoRatio;
              drawX = (convWidth - drawWidth) / 2;
            } else {
              drawHeight = convWidth / videoRatio;
              drawY = (convHeight - drawHeight) / 2;
            }
          }

          ctx.drawImage(video, drawX, drawY, drawWidth, drawHeight);

          // Downsample frame if scaleQuality < 1.0
          let exportCanvas = canvas;
          if (scaleQuality < 1.0 && tempCtx) {
            tempCtx.fillStyle = bgColor;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
            exportCanvas = tempCanvas;
          }

          exportCanvas.toBlob((blob) => {
            if (blob) {
              const frameName = `${customPartName}/frame_${frameIndex.toString().padStart(5, "0")}.png`;
              zip.file(frameName, blob);
            }

            frameIndex++;
            setConvCurrentFrame(frameIndex);
            setConvProgress(Math.floor((frameIndex / totalFrames) * 100));

            time += interval;
            resolve(captureNextFrame());
          }, "image/png");
        };

        video.addEventListener("seeked", onSeeked);
      });
    };

    try {
      await captureNextFrame();
    } catch (e) {
      console.error("Frame capture sequence crashed:", e);
      setConvStatus("error");
    }
  };

  // Structured Data Schema for SEO/GEO/AEO (FAQ Schema Markup)
  const faqSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do you convert video into a custom Android boot animation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To convert a video (like MP4 or WebM) into an Android bootanimation.zip, our client-side compiler extracts frame-by-frame images from the video, sizes them to your mobile screen's dimensions, writes a desc.txt layout configuration file, and packages them in an uncompressed STORE mode ZIP archive that Android bootloaders can read."
          }
        },
        {
          "@type": "Question",
          "name": "Why must the bootanimation.zip file be uncompressed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Android system bootloader needs to play the animation sequence instantly at system start before filesystem storage drivers are fully loaded. As a result, it does not have the library drivers to decompress compressed zip archives. The ZIP must use 'STORE' compression (0% compression level) so frames can be read directly from raw blocks."
          }
        },
        {
          "@type": "Question",
          "name": "How do I install the generated boot animation on my root device?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Copy the compiled bootanimation.zip into /system/media/ (or /product/media/ on modern devices) using a root explorer or custom recovery. Crucially, set the file permissions to '644' (Read-Write for Owner, Read-only for Group/Others) to prevent a black screen during boot."
          }
        }
      ]
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 fade-in relative min-h-screen">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Decorative Glows */}
      <div className="absolute top-20 left-10 w-[350px] h-[350px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Page Title Header */}
      <section className="mb-12 text-center md:text-left relative z-10">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
          <Link href="/studio" className="text-[10px] font-mono text-neutral-455 dark:text-neutral-500 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 rounded transition-colors uppercase tracking-wider font-extrabold">
            ← Back to Studio
          </Link>
          <span className="text-[10px] font-mono text-cyan-550 dark:text-cyan-400 uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20">
            Advanced Tool
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white mt-2 text-gradient">
          Video to Boot Animation Converter
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-3 max-w-3xl leading-relaxed">
          Transform video clips (MP4/WebM) into custom, root-ready Android <code className="text-xs bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 px-1 py-0.5 rounded font-mono text-black dark:text-white">bootanimation.zip</code> files. Clean client-side rendering with trim range select, aspect-fill, resolution scales, and uncompressed compilation.
        </p>
      </section>

      {/* Main Converter Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10 mb-16">
        {/* Left Column: Input Selection & Preview */}
        <div className="space-y-6 md:col-span-1">
          <div className="glass-panel border rounded-2xl p-5 space-y-4 shadow-sm bg-white/70 dark:bg-neutral-950/70">
            <h2 className="text-xs font-mono font-extrabold tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">
              1. Import Video Source
            </h2>

            <div className="relative border border-dashed border-neutral-300 dark:border-neutral-800 hover:border-cyan-400 dark:hover:border-cyan-400/80 rounded-xl p-8 text-center cursor-pointer transition-all bg-white/50 dark:bg-black/50 hover:scale-[1.01] group">
              <input
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleVideoSelect}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div className="text-xs text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-white transition-colors">
                🎥 Click to select <code className="text-neutral-850 dark:text-white font-mono bg-neutral-105 dark:bg-neutral-900 px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-850">.mp4 / .webm</code>
              </div>
            </div>

            {videoFile && (
              <div className="text-xs space-y-2.5 font-mono border-t border-dashed border-neutral-200 dark:border-neutral-850 pt-4 mt-2">
                <div className="flex justify-between">
                  <span className="text-neutral-455 dark:text-neutral-500">File Name:</span>
                  <span className="text-neutral-800 dark:text-white truncate max-w-[140px] font-bold">{videoFile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-455 dark:text-neutral-500">Size:</span>
                  <span className="text-neutral-800 dark:text-white font-semibold">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-455 dark:text-neutral-500">Total Duration:</span>
                  <span className="text-neutral-800 dark:text-white font-bold">{duration.toFixed(2)}s</span>
                </div>
              </div>
            )}

            {videoUrl && (
              <div className="border border-neutral-200 dark:border-neutral-850 rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-inner relative group animate-[fadeIn_0.2s_ease]">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  playsInline
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  className="max-h-full max-w-full"
                />
              </div>
            )}
            
            <canvas
              ref={canvasRef}
              width={convWidth}
              height={convHeight}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Right Columns: Target Settings Panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel border rounded-2xl p-6 space-y-6 shadow-sm bg-white/70 dark:bg-neutral-950/70">
            <h2 className="text-base font-black tracking-tight text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-900 pb-4">
              2. Custom Configuration & Edit Controls
            </h2>

            {/* Custom Edit Grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Resolution settings */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold font-mono tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">
                  📺 Resolution Dimensions
                </h3>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block font-bold">Preset Sizes</label>
                  <CustomDropdown
                    value={resPreset}
                    options={PRESET_OPTIONS}
                    onChange={handlePresetChange}
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-grow space-y-1">
                    <label className="text-[9px] font-mono text-neutral-450 dark:text-neutral-500 uppercase tracking-wider font-bold">Width (px)</label>
                    <input
                      type="number"
                      value={convWidth}
                      onChange={(e) => {
                        setConvWidth(parseInt(e.target.value) || 0);
                        setResPreset("custom");
                      }}
                      className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/10 dark:focus:ring-cyan-400/10 font-mono transition-all font-semibold"
                    />
                  </div>
                  <div className="flex-grow space-y-1">
                    <label className="text-[9px] font-mono text-neutral-450 dark:text-neutral-500 uppercase tracking-wider font-bold">Height (px)</label>
                    <input
                      type="number"
                      value={convHeight}
                      onChange={(e) => {
                        setConvHeight(parseInt(e.target.value) || 0);
                        setResPreset("custom");
                      }}
                      className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/10 dark:focus:ring-cyan-400/10 font-mono transition-all font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Trim clip controls */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold font-mono tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">
                  ✂️ Trim Video Range
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block font-bold">
                      Start Point (s)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max={trimEnd}
                      value={trimStart}
                      onChange={(e) => setTrimStart(parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/10 dark:focus:ring-cyan-400/10 font-mono transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block font-bold">
                      End Point (s)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min={trimStart}
                      max={duration}
                      value={trimEnd}
                      onChange={(e) => setTrimEnd(parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/10 dark:focus:ring-cyan-400/10 font-mono transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="text-[10px] font-mono text-neutral-400">
                  Will convert from <span className="text-cyan-555 dark:text-cyan-400 font-bold">{trimStart.toFixed(1)}s</span> to <span className="text-cyan-555 dark:text-cyan-400 font-bold">{trimEnd.toFixed(1)}s</span> (duration: {(trimEnd - trimStart).toFixed(1)}s).
                </div>
              </div>

              {/* Display & Layout settings */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold font-mono tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">
                  📐 Alignment & Layout fitting
                </h3>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block font-bold">Resize Fit Mode</label>
                  <CustomDropdown
                    value={resizeMode}
                    options={RESIZE_OPTIONS}
                    onChange={(val) => setResizeMode(val as "cover" | "contain")}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-450 dark:text-neutral-500 uppercase block font-bold">Background Margin Fill</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 border border-neutral-205 dark:border-neutral-800 bg-neutral-55 dark:bg-neutral-900 rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-grow bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/10 dark:focus:ring-cyan-400/10 font-mono transition-all font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Quality & Sequence Settings */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold font-mono tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">
                  ⚙️ Compression & Output Parameters
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block font-bold">Speed (FPS)</label>
                    <CustomDropdown
                      value={convFps}
                      options={FPS_OPTIONS}
                      onChange={(val) => setConvFps(val)}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block font-bold">Loop Settings</label>
                    <CustomDropdown
                      value={convLoop}
                      options={LOOP_OPTIONS}
                      onChange={(val) => setConvLoop(val)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block font-bold">Part Directory Name</label>
                    <input
                      type="text"
                      value={customPartName}
                      onChange={(e) => setCustomPartName(e.target.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                      className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-xs text-neutral-800 dark:text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 font-mono transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block font-bold">
                      Downsample Scale
                    </label>
                    <CustomDropdown
                      value={scaleQuality}
                      options={SCALE_OPTIONS}
                      onChange={(val) => setScaleQuality(val)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rendering Progress Indicator */}
            {convStatus !== "idle" && (
              <div className="bg-white/50 dark:bg-black/40 border border-neutral-200 dark:border-neutral-850 p-5 rounded-xl space-y-4 animate-[fadeIn_0.3s_ease]">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-cyan-555 dark:text-cyan-400 uppercase tracking-wider font-extrabold text-[10px]">
                    {convStatus === "rendering" && "⏳ Extracting and resizing video frames..."}
                    {convStatus === "compiling" && "📦 Compiling uncompressed zip archive (STORE Mode)..."}
                    {convStatus === "done" && "✅ Compiled successfully! check downloads"}
                    {convStatus === "error" && "❌ An error occurred during frame compilation"}
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 font-bold">{convProgress}%</span>
                </div>

                <div className="w-full bg-neutral-200 dark:bg-neutral-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 h-full rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(0,223,216,0.3)]"
                    style={{ width: `${convProgress}%` }}
                  />
                </div>

                {convStatus === "rendering" && (
                  <div className="text-[10px] font-mono text-neutral-450 dark:text-neutral-500 text-center">
                    Processing Frame {convCurrentFrame} / {convTotalFrames} (At time {((convCurrentFrame / convFps) + trimStart).toFixed(1)}s)
                  </div>
                )}
              </div>
            )}

            {/* Submit button container */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-900 flex justify-end">
              <button
                onClick={processVideoToBootanim}
                disabled={!videoFile || convStatus === "rendering" || convStatus === "compiling"}
                className="relative overflow-hidden px-6 py-3 rounded-xl text-xs font-bold text-center bg-black hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black border border-neutral-800 dark:border-neutral-205 shadow-md hover:shadow-[0_0_15px_rgba(0,223,216,0.15)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <span className="absolute inset-0 block w-full h-full pointer-events-none">
                  <span className="absolute inset-0 block w-full h-full animate-shimmer bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.15)_40%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0)_60%)] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0)_60%)]" />
                </span>
                <span className="relative z-10 flex items-center gap-1.5">
                  🚀 Compile Video into bootanimation.zip
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content: GEO / AEO Structured FAQ & Documentation section */}
      <section className="border-t border-neutral-200 dark:border-neutral-900 pt-16 max-w-4xl mx-auto font-sans leading-relaxed text-neutral-800 dark:text-neutral-350">
        <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight mb-8 text-center md:text-left">
          Android Boot Animation Conversion Guides & FAQ
        </h2>

        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-neutral-850 dark:text-white">
              Q: What is a Video-to-Bootanimation Converter and how does it work?
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-4 border-l-2 border-cyan-500">
              Our tool is a client-side compiler that runs entirely inside your browser. When you select a video, it decodes and extracts image frames from the video timeline, matches them against target dimensions (e.g. mobile aspect ratios like 20:9 or 16:9), resizes them via Cover/Contain logic, and packages them in an uncompressed STORE mode ZIP archive alongside a desc.txt config layout file.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-neutral-850 dark:text-white">
              Q: Why is the uncompressed (STORE) ZIP compilation mandatory?
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-4 border-l-2 border-cyan-500">
              During the boot sequence, the Android bootloader initializes system animation loops before mounting filesystem storage modules or initialization libraries. It lacks the CPU routines to extract compressed ZIP archives. Thus, custom boot animations must be built using 0% compression (STORE compression). If a compressed ZIP is used, the system boot will render a black screen or trigger a fallback bootloop.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-neutral-850 dark:text-white">
              Q: How do Trim range and Resize modes customize the output?
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-4 border-l-2 border-cyan-500 font-mono">
              • Trim limits the duration to save file size: most bootloader sequence playtimes are short (e.g. 5 to 10 seconds). Converting a whole 1-minute video generates massive file sizes that slow down loading time.
              <br />
              • Cover vs. Contain determines layout: Cover scales and crops the video to fill the screen aspect ratio, while Contain scales fit inside the borders, filling margin spaces with your background color selection (e.g. #000000).
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-neutral-850 dark:text-white">
              Q: What are the installation instructions for custom boot animations?
            </h3>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 pl-4 border-l-2 border-cyan-500 space-y-2">
              <p>To deploy the bootanimation.zip output onto standard custom ROMs (Pixel Experience, LineageOS, Evolution X, etc.):</p>
              <ol className="list-decimal list-inside pl-2 space-y-1.5 font-mono text-[11px]">
                <li>Copy the downloaded output ZIP to your phone and rename it precisely to <code className="text-yellow-600 font-bold">bootanimation.zip</code>.</li>
                <li>Using a root manager (e.g., MiXplorer) mount your storage as read/write and go to <code className="text-cyan-500">/system/media/</code> (or <code className="text-cyan-500">/product/media/</code> depending on ROM architecture).</li>
                <li>Backup the default archive by renaming it to <code className="text-neutral-400">bootanimation.zip.bak</code>.</li>
                <li>Paste your custom bootanimation.zip into the directory.</li>
                <li>Set file permissions to <code className="text-cyan-500">rw-r--r-- (chmod 644)</code>. Incorrect permissions will boot to a black screen!</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
