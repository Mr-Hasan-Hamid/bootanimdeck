"use client";

import CustomDropdown from "@/components/CustomDropdown";
import {
  RESOLUTION_OPTIONS,
  FPS_OPTIONS,
  RESIZE_OPTIONS,
  LOOP_MODE_OPTIONS,
  LOOP_COUNT_OPTIONS,
  SMOOTHING_OPTIONS,
} from "../utils/constants";

interface Props {
  // Resolution
  resolution: string;
  onResolution: (v: string) => void;
  // Trim
  trimStart: number;
  trimEnd: number;
  duration: number;
  onTrimStart: (v: number) => void;
  onTrimEnd: (v: number) => void;
  // FPS + Resize
  convFps: number;
  onFps: (v: number) => void;
  resizeMode: "cover" | "contain";
  onResize: (v: "cover" | "contain") => void;
  // Loop
  loopMode: string;
  onLoopMode: (v: string) => void;
  partLoop: number;
  onPartLoop: (v: number) => void;
  loopSplit: number;
  onLoopSplit: (v: number) => void;
  effectiveFrames: number;
  // Optimization
  dedupe: boolean;
  onDedupe: (v: boolean) => void;
  frameStep: number;
  onFrameStep: (v: number) => void;
  smoothing: number;
  onSmoothing: (v: number) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold font-mono tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase block font-bold">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 font-mono font-semibold transition-all";

export default function SettingsPanel(props: Props) {
  const {
    resolution, onResolution,
    trimStart, trimEnd, duration, onTrimStart, onTrimEnd,
    convFps, onFps, resizeMode, onResize,
    loopMode, onLoopMode, partLoop, onPartLoop, loopSplit, onLoopSplit, effectiveFrames,
    dedupe, onDedupe, frameStep, onFrameStep, smoothing, onSmoothing,
  } = props;

  const trimDuration = Math.max(0, trimEnd - trimStart);

  return (
    <div className="glass-panel border rounded-2xl p-6 space-y-6 shadow-sm bg-white/70 dark:bg-neutral-950/70">
      <h2 className="text-base font-black tracking-tight text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-900 pb-4">
        2. Android Boot Animation Settings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* ── Resolution */}
        <Section title="📺 Target Resolution">
          <CustomDropdown value={resolution} options={RESOLUTION_OPTIONS} onChange={onResolution} />
          <p className="text-[10px] text-neutral-400 dark:text-neutral-600 leading-relaxed">
            480×854 is the sweet spot — sharp on all screens, files stay tiny. 720×1280 only if you need extra crispness.
          </p>
        </Section>

        {/* ── Trim */}
        <Section title="✂️ Trim Range">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start (s)">
              <input
                type="number" step="0.1" min={0} max={trimEnd}
                value={trimStart}
                onChange={e => onTrimStart(parseFloat(e.target.value) || 0)}
                className={inputCls}
              />
            </Field>
            <Field label="End (s)">
              <input
                type="number" step="0.1" min={trimStart} max={duration}
                value={trimEnd}
                onChange={e => onTrimEnd(parseFloat(e.target.value) || 0)}
                className={inputCls}
              />
            </Field>
          </div>
          <p className="text-[10px] font-mono text-neutral-400">
            Clip: <span className="text-cyan-500 font-bold">{trimStart.toFixed(1)}s → {trimEnd.toFixed(1)}s</span>
            {" "}({trimDuration.toFixed(1)}s)
          </p>
        </Section>

        {/* ── FPS + Resize */}
        <Section title="⚙️ Frame Rate & Fit">
          <Field label="FPS">
            <CustomDropdown value={convFps} options={FPS_OPTIONS} onChange={onFps} />
          </Field>
          <Field label="Resize Mode">
            <CustomDropdown value={resizeMode} options={RESIZE_OPTIONS} onChange={v => onResize(v as "cover" | "contain")} />
          </Field>
        </Section>

        {/* ── Loop + Parts */}
        <Section title="🔁 Loop & Parts">
          <Field label="Part Structure">
            <CustomDropdown value={loopMode} options={LOOP_MODE_OPTIONS} onChange={onLoopMode} />
          </Field>

          {loopMode === "intro-loop" ? (
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-neutral-400 uppercase block font-bold">
                Intro: {loopSplit}% · Loop: {100 - loopSplit}%
              </label>
              <input
                type="range" min={10} max={90} step={5}
                value={loopSplit}
                onChange={e => onLoopSplit(parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <p className="text-[10px] font-mono text-neutral-400">
                part0 (1×): ~{Math.floor(effectiveFrames * loopSplit / 100)} frames ·{" "}
                part1 (∞): ~{effectiveFrames - Math.floor(effectiveFrames * loopSplit / 100)} frames
              </p>
            </div>
          ) : (
            <Field label="Loop Count">
              <CustomDropdown value={partLoop} options={LOOP_COUNT_OPTIONS} onChange={onPartLoop} />
            </Field>
          )}
        </Section>

        {/* ── Optimizations — full width */}
        <div className="sm:col-span-2 space-y-4">
          <h3 className="text-xs font-bold font-mono tracking-widest text-neutral-450 dark:text-neutral-500 uppercase">
            🗜 Size Optimizations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Deduplication toggle */}
            <label className="flex items-start gap-3 cursor-pointer bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-cyan-400 transition-colors">
              <div className="mt-0.5 flex-shrink-0 relative">
                <input type="checkbox" checked={dedupe} onChange={e => onDedupe(e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-neutral-300 dark:bg-neutral-700 peer-checked:bg-cyan-500 rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-800 dark:text-white">Skip Duplicate Frames</div>
                <div className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                  Drops identical consecutive frames. Huge savings on static/slow scenes.
                </div>
              </div>
            </label>

            {/* Frame step */}
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-2">
              <label className="text-[10px] font-mono text-neutral-400 uppercase block font-bold">
                Frame Step  (skip every Nth)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={1} max={4} step={1}
                  value={frameStep}
                  onChange={e => onFrameStep(parseInt(e.target.value))}
                  className="flex-grow accent-cyan-500"
                />
                <span className="text-sm font-black font-mono text-cyan-500 w-4 text-right">{frameStep}</span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono">
                Effective: <span className="text-white font-bold">{(convFps / frameStep).toFixed(1)} FPS</span>
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
      </div>
    </div>
  );
}
