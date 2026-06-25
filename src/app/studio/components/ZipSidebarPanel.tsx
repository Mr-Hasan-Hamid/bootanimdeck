"use client";

import { RefObject } from "react";
import animationsData from "../../../data/animations.json";
import type JSZip from "jszip";

interface ZipSidebarPanelProps {
  loadedZip: JSZip | null;
  zipName: string;
  fileCount: number;
  folders: string[];
  isMagiskModule: boolean;
  nestedZipPath: string;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoadFromLibrary: (folderName: string) => void;
  zipPreviewActive: boolean;
  zipPreviewLoading: boolean;
  zipPreviewPlaying: boolean;
  zipPreviewCurrentFrame: number;
  zipPreviewTotalFrames: number;
  prepareZipPreview: () => void;
  toggleZipPreviewPlayback: () => void;
  zipCanvasRef: RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
}

export function ZipSidebarPanel({
  loadedZip,
  zipName,
  fileCount,
  folders,
  isMagiskModule,
  nestedZipPath,
  handleFileUpload,
  handleLoadFromLibrary,
  zipPreviewActive,
  zipPreviewLoading,
  zipPreviewPlaying,
  zipPreviewCurrentFrame,
  zipPreviewTotalFrames,
  prepareZipPreview,
  toggleZipPreviewPlayback,
  zipCanvasRef,
  width,
  height,
}: ZipSidebarPanelProps) {
  return (
    <div className="space-y-6 md:col-span-1">
      <div className="glass-panel border rounded-2xl p-5 space-y-4 shadow-sm bg-white/70 dark:bg-neutral-955/70">
        <h2 className="text-xs font-mono font-extrabold tracking-widest text-neutral-455 dark:text-neutral-500 uppercase">
          Import ZIP Archive
        </h2>

        <div className="relative border border-dashed border-neutral-300 dark:border-neutral-850 hover:border-cyan-400 dark:hover:border-cyan-400/80 rounded-xl p-6 text-center cursor-pointer transition-all bg-white/50 dark:bg-black/50 hover:scale-[1.01] group">
          <input
            type="file"
            accept=".zip"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
          <div className="text-xs text-neutral-505 dark:text-neutral-400 group-hover:text-neutral-850 dark:group-hover:text-white transition-colors">
            📤 Click or drag custom <code className="text-neutral-800 dark:text-white font-mono bg-neutral-100 dark:bg-neutral-900 px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-855">.zip</code>
          </div>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-neutral-200 dark:border-neutral-900"></div>
          <span className="flex-shrink mx-3 text-[10px] font-mono text-neutral-400 dark:text-neutral-600">OR</span>
          <div className="flex-grow border-t border-neutral-200 dark:border-neutral-900"></div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-mono text-neutral-455 dark:text-neutral-500 uppercase tracking-widest font-bold">
            CHOOSE GALLERY PRESET
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) handleLoadFromLibrary(e.target.value);
            }}
            defaultValue=""
            className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-805 text-xs text-neutral-805 dark:text-neutral-200 rounded-xl px-3.5 py-3 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/10 dark:focus:ring-cyan-400/10 transition-all font-semibold"
          >
            <option value="" disabled>
              -- Select Preset --
            </option>
            {animationsData.map((anim) => (
              <option key={anim.id} value={anim.folderName}>
                {anim.name} ({anim.sizeFormatted})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadedZip && (
        <div className="space-y-6">
          <div className="glass-panel border rounded-2xl p-5 space-y-4 animate-[fadeIn_0.3s_ease] shadow-sm bg-white/70 dark:bg-neutral-955/70 font-mono">
            <h2 className="text-xs font-bold tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">
              Package Statistics
            </h2>
            <div className="text-xs space-y-3">
              <div className="flex justify-between border-b border-dashed border-neutral-200 dark:border-neutral-850 pb-2">
                <span className="text-neutral-455 dark:text-neutral-505">File Name:</span>
                <span className="text-neutral-800 dark:text-white text-right truncate max-w-[150px] font-bold">{zipName}</span>
              </div>
              {isMagiskModule && (
                <div className="flex justify-between border-b border-dashed border-neutral-200 dark:border-neutral-850 pb-2 text-[10px] text-cyan-600 dark:text-cyan-400 font-bold font-mono">
                  <span>Installer Module:</span>
                  <span>Magisk / Recovery ZIP</span>
                </div>
              )}
              {isMagiskModule && (
                <div className="flex justify-between border-b border-dashed border-neutral-200 dark:border-neutral-855 pb-2 text-[10px] text-cyan-600 dark:text-cyan-400 font-bold font-mono">
                  <span>Nested Path:</span>
                  <span className="truncate max-w-[130px]">{nestedZipPath}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-dashed border-neutral-200 dark:border-neutral-850 pb-2">
                <span className="text-neutral-455 dark:text-neutral-505">Unzipped Items:</span>
                <span className="text-neutral-800 dark:text-white font-semibold">{fileCount} files</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-neutral-455 dark:text-neutral-505">Directories:</span>
                <span className="text-neutral-800 dark:text-white font-bold truncate max-w-[150px]">
                  {folders.length > 0 ? folders.join(", ") : "None"}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel border rounded-2xl p-5 space-y-4 animate-[fadeIn_0.3s_ease] shadow-sm bg-white/70 dark:bg-neutral-950/70 font-mono">
            <h2 className="text-xs font-mono font-extrabold tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">
              ZIP Playback Simulator
            </h2>

            {zipPreviewActive ? (
              <div className="space-y-4 animate-[fadeIn_0.2s_ease]">
                <div className="relative aspect-[4/3] w-full rounded-xl border border-neutral-200 dark:border-neutral-855 overflow-hidden bg-black flex items-center justify-center shadow-inner">
                  <canvas
                    ref={zipCanvasRef}
                    width={width || 800}
                    height={height || 600}
                    className="w-full h-full object-contain"
                  />
                  {zipPreviewLoading && (
                    <div className="absolute inset-0 skeleton-shimmer z-10 flex items-center justify-center">
                      <span className="text-xs font-mono text-neutral-850 dark:text-neutral-200 font-bold bg-white/80 dark:bg-black/80 border border-neutral-200 dark:border-neutral-850 px-3.5 py-1.5 rounded-xl shadow-lg animate-pulse select-none">
                        ⏳ Loading ZIP frames...
                      </span>
                    </div>
                  )}
                </div>

                {!zipPreviewLoading && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <button
                        onClick={toggleZipPreviewPlayback}
                        className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-805 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-605 dark:text-neutral-350 hover:text-black dark:hover:text-white transition-all text-xs font-semibold"
                      >
                        {zipPreviewPlaying ? "⏸ Pause Simulator" : "▶ Play Preview"}
                      </button>
                      <span className="text-neutral-500 text-[10px]">
                        Frame: {zipPreviewCurrentFrame + 1} / {zipPreviewTotalFrames}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={prepareZipPreview}
                className="w-full relative overflow-hidden px-4 py-2.5 rounded-xl text-xs font-bold text-center bg-black hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black border border-neutral-805 dark:border-neutral-200 shadow-md hover:shadow-[0_0_15px_rgba(0,223,216,0.15)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5"
              >
                <span className="absolute inset-0 block w-full h-full pointer-events-none">
                  <span className="absolute inset-0 block w-full h-full animate-shimmer bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.15)_40%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0)_60%)] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0)_60%)]" />
                </span>
                <span className="relative z-10">🧪 Play Animation Preview</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default ZipSidebarPanel;
