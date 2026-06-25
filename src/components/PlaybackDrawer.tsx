"use client";

import { useEffect, useRef } from "react";
import { AnimationItem } from "@/types/animation";
import { usePlaybackSimulator } from "@/hooks/usePlaybackSimulator";
import DrawerPreview from "./DrawerPreview";
import PlaybackStatsAndInstall from "./PlaybackStatsAndInstall";
import SimulatorControls from "./SimulatorControls";

interface PlaybackDrawerProps {
  selectedAnim: AnimationItem | null;
  onClose: () => void;
}

export function PlaybackDrawer({ selectedAnim, onClose }: PlaybackDrawerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sim = usePlaybackSimulator(selectedAnim, canvasRef);

  useEffect(() => {
    if (selectedAnim) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedAnim]);

  if (!selectedAnim) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex-grow" onClick={onClose} />

      <div className="w-full max-w-xl bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-900 flex flex-col h-screen max-h-screen shadow-2xl slide-in-right overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/50 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex-grow pr-4">
            <span className="text-[9px] font-mono text-cyan-555 dark:text-cyan-400 uppercase tracking-widest font-extrabold px-2 py-0.5 rounded bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20 font-mono">
              {"Boot Animation"}
            </span>
            <h2 className="text-xl font-black tracking-tight text-neutral-900 dark:text-white mt-2 leading-tight">
              {selectedAnim.name}
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={selectedAnim.zipUrl}
              download
              className="relative overflow-hidden px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-neutral-950 hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 border border-neutral-800 dark:border-neutral-200 transition-all duration-200 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-[0_0_15px_rgba(0,223,216,0.15)]"
            >
              <span className="absolute inset-0 block w-full h-full pointer-events-none">
                <span className="absolute inset-0 block w-full h-full animate-shimmer bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.15)_40%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0)_60%)] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0)_60%)]" />
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              <span>Download ZIP</span>
            </a>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-455 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors font-mono"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-8 scrollbar-none font-mono">
          {/* Simulator Panel */}
          <div className="space-y-4 font-mono">
            <h3 className="text-xs font-semibold font-mono tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
              Live Playback Simulator
            </h3>

            <div
              className="relative aspect-[4/3] w-full rounded-xl border border-neutral-200 dark:border-neutral-850 overflow-hidden flex flex-col items-center justify-center shadow-inner"
              style={{ backgroundColor: sim.canvasBg }}
            >
              {sim.simActive ? (
                <canvas
                  ref={canvasRef}
                  width={selectedAnim.width || 800}
                  height={selectedAnim.height || 600}
                  className="w-full h-full object-contain"
                />
              ) : (
                selectedAnim.gifUrl && (
                  <DrawerPreview
                    gifUrl={selectedAnim.gifUrl}
                    coverUrl={selectedAnim.coverUrl || ""}
                    alt={selectedAnim.name}
                  />
                )
              )}

              {sim.loadingFrames && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <span className="text-xs font-mono text-neutral-400 animate-pulse">
                    Loading frames into memory...
                  </span>
                </div>
              )}
            </div>

            <SimulatorControls
              simActive={sim.simActive}
              isSimPlaying={sim.isSimPlaying}
              currentFrameIndex={sim.currentFrameIndex}
              totalFrames={sim.frames.length}
              simFps={sim.simFps}
              canvasBg={sim.canvasBg}
              startFrameSimulator={sim.startFrameSimulator}
              toggleSimPlayback={sim.toggleSimPlayback}
              setIsSimPlaying={sim.setIsSimPlaying}
              setCurrentFrameIndex={sim.setCurrentFrameIndex}
              setSimFps={sim.setSimFps}
              setCanvasBg={sim.setCanvasBg}
            />
          </div>

          <PlaybackStatsAndInstall selectedAnim={selectedAnim} />
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 flex gap-4 shrink-0 font-sans">
          <a
            href={selectedAnim.zipUrl}
            download
            className="relative overflow-hidden flex-grow py-3 rounded-xl text-xs font-bold text-center bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/25 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] font-mono"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download ({selectedAnim.sizeFormatted})
          </a>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-455 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors text-xs font-semibold font-mono"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaybackDrawer;
