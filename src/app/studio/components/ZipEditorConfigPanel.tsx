"use client";

import CompatibilityReport from "./CompatibilityReport";
import ZipPartRow from "./ZipPartRow";

interface PartConfig {
  type: string;
  loopCount: number;
  pause: number;
  folder: string;
}

interface ZipEditorConfigPanelProps {
  width: number;
  setWidth: (v: number) => void;
  height: number;
  setHeight: (v: number) => void;
  fps: number;
  setFps: (v: number) => void;
  parts: PartConfig[];
  setParts: (p: PartConfig[]) => void;
  folders: string[];
  lintErrors: string[];
  lintWarnings: string[];
  addPartConfig: () => void;
  removePartConfig: (index: number) => void;
  onCloseWorkspace: () => void;
  onExport: () => void;
}

export function ZipEditorConfigPanel({
  width,
  setWidth,
  height,
  setHeight,
  fps,
  setFps,
  parts,
  setParts,
  folders,
  lintErrors,
  lintWarnings,
  addPartConfig,
  removePartConfig,
  onCloseWorkspace,
  onExport,
}: ZipEditorConfigPanelProps) {
  return (
    <div className="md:col-span-2 space-y-6">
      <div className="glass-panel border rounded-2xl p-6 space-y-6 shadow-sm bg-white/70 dark:bg-neutral-950/70">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-900">
          <h2 className="text-base font-black tracking-tight text-neutral-900 dark:text-white">
            Animation Settings (desc.txt)
          </h2>
          <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-555 dark:text-cyan-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg">
            ⚡ STORE COMPRESSION
          </span>
        </div>

        <CompatibilityReport lintErrors={lintErrors} lintWarnings={lintWarnings} />

        {/* Resolution & FPS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-mono text-neutral-455 dark:text-neutral-500 uppercase tracking-wider font-extrabold">
              Width
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
              className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/10 dark:focus:ring-cyan-400/10 font-mono transition-all font-semibold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-mono text-neutral-455 dark:text-neutral-500 uppercase tracking-wider font-extrabold">
              Height
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
              className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/10 dark:focus:ring-cyan-400/10 font-mono transition-all font-semibold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-mono text-neutral-455 dark:text-neutral-500 uppercase tracking-wider font-extrabold">
              FPS Speed
            </label>
            <input
              type="number"
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value) || 0)}
              className="w-full bg-neutral-55 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/10 dark:focus:ring-cyan-400/10 font-mono transition-all font-semibold"
            />
          </div>
        </div>

        {/* Parts Table */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-mono tracking-widest text-neutral-455 dark:text-neutral-500 uppercase font-bold">
              Loop Parts Configuration
            </h3>
            <button
              onClick={addPartConfig}
              className="text-[10px] font-mono text-cyan-550 dark:text-cyan-400 hover:text-neutral-800 dark:hover:text-white transition-colors flex items-center gap-1 font-bold"
            >
              <span>+ Add Loop Row</span>
            </button>
          </div>

          <div className="space-y-3">
            {parts.length > 0 ? (
              parts.map((part, idx) => (
                <ZipPartRow
                  key={idx}
                  part={part}
                  index={idx}
                  parts={parts}
                  setParts={setParts}
                  folders={folders}
                  onRemove={() => removePartConfig(idx)}
                />
              ))
            ) : (
              <div className="py-8 text-center border border-dashed border-neutral-200 dark:border-neutral-850 rounded-xl text-neutral-450 dark:text-neutral-600 font-mono text-xs">
                No parameters defined. Add a loop row.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-900 flex justify-end gap-3">
          <button
            onClick={onCloseWorkspace}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-semibold text-neutral-655 dark:text-neutral-455 hover:text-black dark:hover:text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            Close Workspace
          </button>
          <button
            onClick={onExport}
            className="relative overflow-hidden px-5 py-2.5 rounded-xl text-xs font-bold text-center bg-black hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black border border-neutral-800 dark:border-neutral-200 shadow-md hover:shadow-[0_0_15px_rgba(0,223,216,0.15)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5"
          >
            <span className="absolute inset-0 block w-full h-full pointer-events-none">
              <span className="absolute inset-0 block w-full h-full animate-shimmer bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.15)_40%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0)_60%)] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0)_60%)]" />
            </span>
            <span className="relative z-10 flex items-center gap-1.5">💾 Compile & Download ZIP</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ZipEditorConfigPanel;
