"use client";

import { RESOLUTION_MAP } from "../utils/constants";
import { formatBytes, estimateSize } from "../utils/frameUtils";

interface Props {
  resolution: string;
  convFps: number;
  frameStep: number;
  trimStart: number;
  trimEnd: number;
  smoothing: number;
}

export default function SizeEstimator({ resolution, convFps, frameStep, trimStart, trimEnd, smoothing }: Props) {
  const { w, h } = RESOLUTION_MAP[resolution];
  const duration = Math.max(0, trimEnd - trimStart);
  const frames   = Math.max(1, Math.ceil(duration * convFps / frameStep));
  const estBytes = estimateSize(w, h, frames, smoothing);

  const color = estBytes > 40 * 1024 * 1024
    ? "text-red-500"
    : estBytes > 15 * 1024 * 1024
      ? "text-yellow-500"
      : "text-emerald-500";

  return (
    <div className="rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 space-y-2 font-mono text-[10px]">
      <div className="text-neutral-450 dark:text-neutral-500 uppercase tracking-wider font-bold mb-1">
        📊 Estimated Output
      </div>
      {[
        ["Resolution",    `${w} × ${h}`],
        ["Capture rate",  `${(convFps / frameStep).toFixed(1)} FPS effective`],
        ["~Frames",       `${frames}`],
        ["~ZIP size",     formatBytes(estBytes)],
      ].map(([label, value], i) => (
        <div key={i} className="flex justify-between">
          <span className="text-neutral-500">{label}</span>
          <span className={`font-black ${i === 3 ? color : "text-white"}`}>{value}</span>
        </div>
      ))}
      {estBytes > 15 * 1024 * 1024 && (
        <p className="text-yellow-600 dark:text-yellow-400 text-[9px] pt-1 border-t border-neutral-200 dark:border-neutral-800 leading-relaxed">
          ⚠ Try 480×854 + 12 FPS + frame step 2 to get under 5 MB.
        </p>
      )}
    </div>
  );
}
