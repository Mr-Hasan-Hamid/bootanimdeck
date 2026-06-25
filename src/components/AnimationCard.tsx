import HoverPreview from "./HoverPreview";
import { AnimationItem } from "@/types/animation";

interface AnimationCardProps {
  anim: AnimationItem;
  onSelect: (anim: AnimationItem) => void;
}

export default function AnimationCard({ anim, onSelect }: AnimationCardProps) {
  return (
    <div
      className="anim-card group cursor-pointer bg-neutral-55 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 rounded-2xl overflow-hidden flex flex-col h-full"
      onClick={() => onSelect(anim)}
    >
      <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center border-b border-neutral-200 dark:border-neutral-900">
        {anim.gifUrl ? (
          <HoverPreview gifUrl={anim.gifUrl} coverUrl={anim.coverUrl} alt={anim.name} />
        ) : (
          <div className="text-xs text-neutral-600 font-mono">No Preview</div>
        )}
        <div className="absolute top-3 left-3 bg-neutral-100/90 dark:bg-black/80 backdrop-blur border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono px-2 py-0.5 rounded text-neutral-500 dark:text-neutral-400">
          {anim.width} × {anim.height}
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow font-mono text-xs">
        <div>
          <h3 className="text-xs font-bold tracking-tight text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-cyan-500 transition-colors flex items-center gap-1.5">
            <span className="text-cyan-500 font-extrabold">&gt;</span>
            <span>{anim.name}</span>
          </h3>
          <div className="mt-2.5 space-y-1 text-[10px] text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400 dark:text-neutral-600">file:</span>
              <span className="truncate select-all" title={anim.zipName}>
                {anim.zipName}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-900/60 text-[10px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1">
            <span className="text-neutral-400 dark:text-neutral-600">fps:</span>
            <span className="text-neutral-800 dark:text-neutral-300 font-bold">{anim.fps}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-neutral-400 dark:text-neutral-600">size:</span>
            <span className="text-neutral-800 dark:text-neutral-300 font-bold">
              {anim.sizeFormatted}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
