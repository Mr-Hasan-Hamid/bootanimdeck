"use client";

import HoverPreview from "@/components/HoverPreview";

interface MinimialAnimationItem {
  id: string;
  name: string;
  zipName: string;
  width: number;
  height: number;
  fps: number;
  sizeFormatted: string;
  gifUrl: string | null;
  coverUrl: string | null;
}

interface BulkAnimationCardProps {
  anim: MinimialAnimationItem;
  isChecked: boolean;
  onToggleSelect: (id: string) => void;
}

export function BulkAnimationCard({
  anim,
  isChecked,
  onToggleSelect
}: BulkAnimationCardProps) {
  return (
    <div
      onClick={() => onToggleSelect(anim.id)}
      className={`anim-card group cursor-pointer border rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 ${
        isChecked
          ? "border-cyan-500 bg-cyan-50/5 dark:bg-cyan-950/10 shadow-lg"
          : "border-neutral-200 dark:border-neutral-900 bg-neutral-55 dark:bg-neutral-950"
      }`}
    >
      {/* Media area */}
      <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center border-b border-neutral-200 dark:border-neutral-900">
        {anim.gifUrl ? (
          <HoverPreview gifUrl={anim.gifUrl} coverUrl={anim.coverUrl} alt={anim.name} />
        ) : (
          <div className="text-xs text-neutral-600 font-mono">No Preview</div>
        )}
        
        {/* Resolution badge */}
        <div className="absolute top-3 left-3 bg-neutral-100/90 dark:bg-black/80 backdrop-blur border border-neutral-200 dark:border-neutral-800 text-[9px] font-mono px-2 py-0.5 rounded text-neutral-500 dark:text-neutral-400 pointer-events-none">
          {anim.width} × {anim.height}
        </div>

        {/* Checkbox overlay */}
        <div className="absolute top-3 right-3 z-10">
          <div className={`h-6 w-6 rounded-lg flex items-center justify-center border transition-all duration-200 backdrop-blur ${
            isChecked
              ? "bg-cyan-500 border-cyan-500 text-white shadow-md shadow-cyan-500/20 scale-105"
              : "border-neutral-300 dark:border-neutral-700 bg-black/40 text-transparent"
          }`}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info block */}
      <div className="p-4 flex flex-col justify-between flex-grow font-mono text-xs select-none">
        <div>
          <h3 className={`text-xs font-bold tracking-tight line-clamp-1 transition-colors flex items-center gap-1.5 ${
            isChecked ? "text-cyan-500" : "text-neutral-900 dark:text-neutral-100"
          }`}>
            <span className="text-cyan-500 font-extrabold">&gt;</span>
            <span>{anim.name}</span>
          </h3>
          <div className="mt-2 text-[9px] text-neutral-500 dark:text-neutral-455">
            <span className="truncate block" title={anim.zipName}>{anim.zipName}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-900/60 text-[9px] text-neutral-450">
          <div>
            <span>fps: </span>
            <span className="text-neutral-800 dark:text-neutral-300 font-bold">{anim.fps}</span>
          </div>
          <div>
            <span>size: </span>
            <span className="text-neutral-800 dark:text-neutral-300 font-bold">{anim.sizeFormatted}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkAnimationCard;
