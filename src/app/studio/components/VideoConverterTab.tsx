"use client";

import { useRef } from "react";
import Link from "next/link";
import { useStudioVideoConverter } from "../hooks/useStudioVideoConverter";
import StudioProgressBlock from "./StudioProgressBlock";

export function VideoConverterTab() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    videoFile,
    videoUrl,
    convWidth,
    convHeight,
    convFps,
    convLoop,
    convStatus,
    convProgress,
    convCurrentFrame,
    convTotalFrames,
    setConvWidth,
    setConvHeight,
    setConvFps,
    setConvLoop,
    handleVideoSelect,
    processVideoToBootanim,
  } = useStudioVideoConverter(videoRef, canvasRef);

  return (
    <div className="space-y-6 relative z-10 animate-[fadeIn_0.3s_ease]">
      {/* Link banner */}
      <div className="glass-panel border border-cyan-500/15 dark:border-cyan-400/20 rounded-2xl p-5 bg-cyan-500/5 dark:bg-cyan-400/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 font-mono">
            ⚡ Standalone Video to Bootanimation Converter
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xl">
            Looking for fine-grained options? Launch our standalone page featuring precision timeline
            trimming, fit modes, and structured FAQs.
          </p>
        </div>
        <Link
          href="/video-to-bootanimation"
          className="relative overflow-hidden px-4.5 py-2 rounded-xl text-xs font-bold text-center bg-black hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black border border-neutral-800 dark:border-neutral-200 shadow-md hover:shadow-[0_0_15px_rgba(0,223,216,0.15)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center shrink-0"
        >
          Open Page →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left: Import */}
        <div className="glass-panel border rounded-2xl p-5 space-y-6 md:col-span-1 shadow-sm bg-white/70 dark:bg-neutral-955/70 font-mono">
          <h2 className="text-xs font-mono font-extrabold tracking-widest text-neutral-455 dark:text-neutral-500 uppercase animate-pulse">
            Import Video Source
          </h2>

          <div className="relative border border-dashed border-neutral-300 dark:border-neutral-800 hover:border-cyan-400 dark:hover:border-cyan-400/80 rounded-xl p-8 text-center cursor-pointer transition-all bg-white/50 dark:bg-black/50 hover:scale-[1.01] group">
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={handleVideoSelect}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <div className="text-xs text-neutral-505 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-white transition-colors">
              🎥 Click to import <code className="text-neutral-805 dark:text-white font-mono bg-neutral-100 dark:bg-neutral-900 px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-850">.mp4 / .webm</code>
            </div>
          </div>

          {videoFile && (
            <div className="text-xs space-y-3 font-mono border-b border-dashed border-neutral-200 dark:border-neutral-850 pb-4">
              <div className="flex justify-between">
                <span className="text-neutral-455 dark:text-neutral-505">File Name:</span>
                <span className="text-neutral-800 dark:text-white truncate max-w-[140px] font-bold">{videoFile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-455 dark:text-neutral-505">Size:</span>
                <span className="text-neutral-800 dark:text-white font-semibold">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            </div>
          )}

          {videoUrl && (
            <div className="border border-neutral-200 dark:border-neutral-855 rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-inner">
              <video ref={videoRef} src={videoUrl} controls playsInline className="max-h-full max-w-full" />
            </div>
          )}

          <canvas ref={canvasRef} width={convWidth} height={convHeight} style={{ display: "none" }} />
        </div>

        {/* Right: Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel border rounded-2xl p-6 space-y-6 shadow-sm bg-white/70 dark:bg-neutral-950/70">
            <h2 className="text-base font-black tracking-tight text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-900 pb-4">
              Target Compilation Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-neutral-455 dark:text-neutral-500 uppercase tracking-wider font-extrabold">Resolution Preset</label>
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "fhd-plus") { setConvWidth(1080); setConvHeight(2400); }
                    else if (val === "fhd") { setConvWidth(1080); setConvHeight(1920); }
                    else if (val === "hd") { setConvWidth(720); setConvHeight(1280); }
                  }}
                  defaultValue="fhd-plus"
                  className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 rounded-xl px-3.5 py-3 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition-all font-semibold"
                >
                  <option value="fhd-plus">1080 × 2400 (FHD+ 20:9)</option>
                  <option value="fhd">1080 × 1920 (FHD 16:9)</option>
                  <option value="hd">720 × 1280 (HD 16:9)</option>
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-grow space-y-1.5">
                  <label className="text-[9px] text-neutral-455 dark:text-neutral-500 uppercase tracking-wider font-extrabold">Width</label>
                  <input
                    type="number" value={convWidth} onChange={(e) => setConvWidth(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-805 text-xs text-neutral-800 dark:text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-all font-semibold"
                  />
                </div>
                <div className="flex-grow space-y-1.5">
                  <label className="text-[9px] text-neutral-455 dark:text-neutral-500 uppercase tracking-wider font-extrabold">Height</label>
                  <input
                    type="number" value={convHeight} onChange={(e) => setConvHeight(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-xs text-neutral-800 dark:text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] text-neutral-455 dark:text-neutral-500 uppercase tracking-wider font-extrabold">Target FPS</label>
                <select
                  value={convFps} onChange={(e) => setConvFps(parseInt(e.target.value))}
                  className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-805 dark:text-neutral-200 rounded-xl px-3.5 py-3 focus:outline-none focus:border-cyan-500 transition-all font-semibold"
                >
                  <option value={15}>15 FPS (Small File)</option>
                  <option value={24}>24 FPS</option>
                  <option value={30}>30 FPS (Recommended)</option>
                  <option value={60}>60 FPS (Ultra Smooth)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] text-neutral-455 dark:text-neutral-500 uppercase tracking-wider font-extrabold">Loop Behavior</label>
                <select
                  value={convLoop} onChange={(e) => setConvLoop(parseInt(e.target.value))}
                  className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-805 text-xs text-neutral-805 dark:text-neutral-200 rounded-xl px-3.5 py-3 focus:outline-none focus:border-cyan-505 transition-all font-semibold"
                >
                  <option value={0}>Infinite Loop (Standard)</option>
                  <option value={1}>Play Once and Freeze</option>
                </select>
              </div>
            </div>

            <StudioProgressBlock
              convStatus={convStatus} convProgress={convProgress}
              convCurrentFrame={convCurrentFrame} convTotalFrames={convTotalFrames}
            />

            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-900 flex justify-end">
              <button
                onClick={processVideoToBootanim}
                disabled={!videoFile || convStatus === "rendering" || convStatus === "compiling"}
                className="relative overflow-hidden px-5 py-2.5 rounded-xl text-xs font-bold text-center bg-black hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black border border-neutral-800 dark:border-neutral-205 shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 font-mono"
              >
                <span className="absolute inset-0 block w-full h-full pointer-events-none">
                  <span className="absolute inset-0 block w-full h-full animate-shimmer bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.15)_40%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0)_60%)] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0)_60%)]" />
                </span>
                <span>🚀 Process Video & Generate ZIP</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoConverterTab;
