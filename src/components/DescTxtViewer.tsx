"use client";

import { AnimationItem } from "@/types/animation";

interface DescTxtViewerProps {
  selectedAnim: AnimationItem;
}

export function DescTxtViewer({ selectedAnim }: DescTxtViewerProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold font-mono tracking-wider text-neutral-450 dark:text-neutral-500 uppercase">
        Config File (desc.txt)
      </h3>
      <div className="bg-[#0b0c10] border border-neutral-855 rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-900 bg-[#0d0e12]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[10px] font-mono text-neutral-505">desc.txt</span>
          <div className="w-10" />
        </div>
        <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-neutral-300">
          <div className="text-neutral-600 mb-1">{"// Resolution, Aspect, and Target FPS"}</div>
          <div className="mb-2">
            <span className="text-cyan-400">{selectedAnim.width}</span>{" "}
            <span className="text-cyan-400">{selectedAnim.height}</span>{" "}
            <span className="text-purple-400">{selectedAnim.fps}</span>
          </div>
          <div className="text-neutral-600 mb-1">
            {"// Animation Parts (Type, LoopCount, Pause, Folder)"}
          </div>
          {selectedAnim.parts.map((p, idx) => (
            <div key={idx} className="hover:bg-white/5 px-1.5 py-0.5 rounded transition-colors">
              <span className="text-pink-400 font-bold">{p.type}</span>{" "}
              <span className="text-cyan-400">{p.loopCount}</span>{" "}
              <span className="text-amber-400">{p.pause}</span>{" "}
              <span className="text-emerald-400">&ldquo;{p.folder}&rdquo;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DescTxtViewer;
