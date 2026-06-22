"use client";

import { formatBytes } from "../utils/frameUtils";
import type { ConverterProgress } from "../hooks/useVideoConverter";

interface Props {
  progress: ConverterProgress;
  onCancel: () => void;
  onConvert: () => void;
  canConvert: boolean;
}

const STATUS_LABEL: Record<string, string> = {
  rendering:  "⏳ Extracting frames…",
  compiling:  "📦 Packaging ZIP (STORE mode)…",
  done:       "✅ Done! Check your downloads.",
  error:      "❌ Error during conversion.",
};

export default function ProgressPanel({ progress, onCancel, onConvert, canConvert }: Props) {
  const { status, progress: pct, currentFrame, totalFrames, dedupedCount, resultSize } = progress;
  const isRunning = status === "rendering" || status === "compiling";

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      {status !== "idle" && (
        <div className="bg-white/50 dark:bg-black/40 border border-neutral-200 dark:border-neutral-850 p-5 rounded-xl space-y-3 animate-[fadeIn_0.3s_ease]">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-cyan-555 dark:text-cyan-400 uppercase tracking-wider font-extrabold text-[10px]">
              {STATUS_LABEL[status]}
            </span>
            <span className="text-neutral-500 font-bold">{pct}%</span>
          </div>

          <div className="w-full bg-neutral-200 dark:bg-neutral-900 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-purple-600 h-full rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(0,223,216,0.3)]"
              style={{ width: `${pct}%` }}
            />
          </div>

          {status === "rendering" && (
            <div className="flex justify-between text-[10px] font-mono text-neutral-450 dark:text-neutral-500">
              <span>Frame {currentFrame} / {totalFrames}</span>
              {dedupedCount > 0 && (
                <span className="text-emerald-500">⚡ {dedupedCount} dupes skipped</span>
              )}
            </div>
          )}

          {status === "done" && resultSize > 0 && (
            <div className="flex gap-4 text-[10px] font-mono pt-1 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500">Final ZIP:</span>
              <span className={`font-black ${resultSize < 10 * 1024 * 1024 ? "text-emerald-500" : resultSize < 30 * 1024 * 1024 ? "text-yellow-500" : "text-red-500"}`}>
                {formatBytes(resultSize)}
              </span>
              {dedupedCount > 0 && (
                <>
                  <span className="text-neutral-500">·</span>
                  <span className="text-emerald-500">{dedupedCount} frames deduped</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-900 flex items-center justify-between gap-4">
        {isRunning && (
          <button
            onClick={onCancel}
            className="px-5 py-3 rounded-xl text-xs font-bold border border-red-500/40 text-red-500 hover:bg-red-500/10 transition-all"
          >
            ✕ Cancel
          </button>
        )}
        <button
          onClick={onConvert}
          disabled={!canConvert || isRunning}
          className="ml-auto relative overflow-hidden px-6 py-3 rounded-xl text-xs font-bold bg-black hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black border border-neutral-800 dark:border-neutral-205 shadow-md hover:shadow-[0_0_15px_rgba(0,223,216,0.15)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <span className="absolute inset-0 pointer-events-none">
            <span className="absolute inset-0 animate-shimmer bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.15)_40%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0)_60%)] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0)_60%)]" />
          </span>
          <span className="relative z-10 flex items-center gap-1.5">
            🚀 Compile bootanimation.zip
          </span>
        </button>
      </div>
    </div>
  );
}
