"use client";

import { RESOLUTION_MAP } from "../utils/constants";

interface Props {
  resolution: string;
  convFps: number;
  loopMode: string;
  partLoop: number;
}

export default function DescPreview({ resolution, convFps, loopMode, partLoop }: Props) {
  const { w, h } = RESOLUTION_MAP[resolution];
  const lines = [
    `${w} ${h} ${convFps}`,
    loopMode === "intro-loop"
      ? "p 1 0 part0\np 0 0 part1"
      : `p ${partLoop} 0 part0`,
  ];

  return (
    <div className="glass-panel border rounded-2xl p-5 bg-white/70 dark:bg-neutral-950/70 shadow-sm">
      <h3 className="text-xs font-mono font-extrabold tracking-widest text-neutral-450 dark:text-neutral-500 uppercase mb-3">
        📄 desc.txt Preview
      </h3>
      <pre className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-neutral-50 dark:bg-black/60 border border-neutral-200 dark:border-neutral-900 rounded-xl p-4 leading-loose whitespace-pre-wrap">
        {lines.join("\n")}
      </pre>
      <p className="text-[10px] text-neutral-400 mt-2 font-mono">
        This file is auto-included in the ZIP — Android reads it to know resolution, FPS, and how to loop parts.
      </p>
    </div>
  );
}
