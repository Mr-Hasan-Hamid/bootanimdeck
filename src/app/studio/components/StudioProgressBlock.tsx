"use client";

interface StudioProgressBlockProps {
  convStatus: "idle" | "rendering" | "compiling" | "done" | "error";
  convProgress: number;
  convCurrentFrame: number;
  convTotalFrames: number;
}

export function StudioProgressBlock({
  convStatus,
  convProgress,
  convCurrentFrame,
  convTotalFrames,
}: StudioProgressBlockProps) {
  if (convStatus === "idle") return null;

  return (
    <div className="bg-white/50 dark:bg-black/40 border border-neutral-200 dark:border-neutral-850 p-5 rounded-xl space-y-4 animate-[fadeIn_0.3s_ease] font-mono">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="text-cyan-550 dark:text-cyan-400 uppercase tracking-wider font-extrabold text-[10px]">
          {convStatus === "rendering" && "⏳ Extracting Video Frames..."}
          {convStatus === "compiling" && "📦 Compiling uncompressed ZIP..."}
          {convStatus === "done" && "✅ Done! ZIP Downloaded"}
          {convStatus === "error" && "❌ Extraction Error"}
        </span>
        <span className="text-neutral-505 dark:text-neutral-400 font-bold">{convProgress}%</span>
      </div>

      <div className="w-full bg-neutral-200 dark:bg-neutral-900 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-cyan-500 to-purple-600 h-full rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(0,223,216,0.3)]"
          style={{ width: `${convProgress}%` }}
        />
      </div>

      {convStatus === "rendering" && (
        <div className="text-[10px] font-mono text-neutral-455 dark:text-neutral-500 text-center">
          Processing frame {convCurrentFrame} / {convTotalFrames}
        </div>
      )}
    </div>
  );
}

export default StudioProgressBlock;
