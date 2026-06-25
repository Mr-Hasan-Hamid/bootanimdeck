"use client";

import CustomDropdown from "@/components/CustomDropdown";
import { SMOOTHING_OPTIONS } from "../utils/constants";

interface SizeOptimizationsProps {
  dedupe: boolean;
  onDedupe: (v: boolean) => void;
  frameStep: number;
  onFrameStep: (v: number) => void;
  smoothing: number;
  onSmoothing: (v: number) => void;
  convFps: number;
}

export default function SizeOptimizationsSection({
  dedupe,
  onDedupe,
  frameStep,
  onFrameStep,
  smoothing,
  onSmoothing,
  convFps,
}: SizeOptimizationsProps) {
  return (
    <div className="sm:col-span-2 space-y-4">
      <h3 className="text-xs font-bold font-mono tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">
        🗜 Size Optimizations
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Deduplication toggle */}
        <label className="flex items-start gap-3 cursor-pointer bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-cyan-400 transition-colors">
          <div className="mt-0.5 flex-shrink-0 relative">
            <input
              type="checkbox"
              checked={dedupe}
              onChange={(e) => onDedupe(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-neutral-300 dark:bg-neutral-700 peer-checked:bg-cyan-500 rounded-full transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-800 dark:text-white">
              Skip Duplicate Frames
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
              Drops identical consecutive frames. Huge savings on static/slow scenes.
            </div>
          </div>
        </label>

        {/* Frame step */}
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-2">
          <label className="text-[10px] font-mono text-neutral-400 uppercase block font-bold">
            Frame Step (skip every Nth)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={4}
              step={1}
              value={frameStep}
              onChange={(e) => onFrameStep(parseInt(e.target.value))}
              className="flex-grow accent-cyan-500"
            />
            <span className="text-sm font-black font-mono text-cyan-500 w-4 text-right">
              {frameStep}
            </span>
          </div>
          <p className="text-[10px] text-neutral-400 font-mono">
            Effective:{" "}
            <span className="text-white font-bold">{(convFps / frameStep).toFixed(1)} FPS</span>
          </p>
        </div>

        {/* PNG Smoothing */}
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-2">
          <label className="text-[10px] font-mono text-neutral-400 uppercase block font-bold">
            PNG Smoothing
          </label>
          <CustomDropdown value={smoothing} options={SMOOTHING_OPTIONS} onChange={onSmoothing} />
          <p className="text-[10px] text-neutral-400 font-mono leading-relaxed">
            Slight blur reduces PNG entropy → smaller files, invisible on screen.
          </p>
        </div>
      </div>
    </div>
  );
}
