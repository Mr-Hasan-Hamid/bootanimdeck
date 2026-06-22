"use client";

import { useRef } from "react";
import { formatBytes } from "../utils/frameUtils";

interface Props {
  videoFile: File | null;
  videoUrl: string;
  duration: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLoaded: () => void;
}

export default function VideoDropZone({ videoFile, videoUrl, duration, videoRef, onSelect, onLoaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="glass-panel border rounded-2xl p-5 space-y-4 shadow-sm bg-white/70 dark:bg-neutral-950/70">
      <h2 className="text-xs font-mono font-extrabold tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">
        1. Import Video
      </h2>

      {/* Drop zone */}
      <div
        className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-cyan-400 dark:hover:border-cyan-400/80 rounded-xl p-8 text-center cursor-pointer transition-all bg-white/50 dark:bg-black/50 hover:scale-[1.01] group"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm"
          onChange={onSelect}
          className="hidden"
        />
        <div className="text-2xl mb-2">🎬</div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 group-hover:text-white transition-colors">
          Click to select{" "}
          <code className="font-mono bg-neutral-100 dark:bg-neutral-900 px-1 rounded border border-neutral-200 dark:border-neutral-850">
            .mp4 / .webm
          </code>
        </div>
      </div>

      {/* File metadata */}
      {videoFile && (
        <div className="text-xs space-y-2 font-mono border-t border-dashed border-neutral-200 dark:border-neutral-850 pt-4">
          {[
            ["File", videoFile.name],
            ["Size", formatBytes(videoFile.size)],
            ["Duration", `${duration.toFixed(2)}s`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-neutral-455 dark:text-neutral-500">{label}</span>
              <span className="text-neutral-800 dark:text-white font-bold truncate max-w-[140px]">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Video preview */}
      {videoUrl && (
        <div className="border border-neutral-200 dark:border-neutral-850 rounded-xl overflow-hidden bg-black aspect-video">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            onLoadedMetadata={onLoaded}
            className="w-full max-h-full"
          />
        </div>
      )}
    </div>
  );
}
