"use client";

interface SimulatorControlsProps {
  simActive: boolean;
  isSimPlaying: boolean;
  currentFrameIndex: number;
  totalFrames: number;
  simFps: number;
  canvasBg: string;
  startFrameSimulator: () => void;
  toggleSimPlayback: () => void;
  setIsSimPlaying: (playing: boolean) => void;
  setCurrentFrameIndex: (idx: number) => void;
  setSimFps: (fps: number) => void;
  setCanvasBg: (color: string) => void;
}

export function SimulatorControls({
  simActive,
  isSimPlaying,
  currentFrameIndex,
  totalFrames,
  simFps,
  canvasBg,
  startFrameSimulator,
  toggleSimPlayback,
  setIsSimPlaying,
  setCurrentFrameIndex,
  setSimFps,
  setCanvasBg,
}: SimulatorControlsProps) {
  if (!simActive) {
    return (
      <button onClick={startFrameSimulator} className="btn-primary w-full text-center font-bold font-mono text-xs py-3 rounded-xl">
        🧪 Run Frame-by-Frame Simulator
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-855 p-4 rounded-xl font-mono text-xs">
      <div className="flex items-center justify-between">
        <button
          onClick={toggleSimPlayback}
          className="btn-secondary font-semibold text-[12px] px-3 py-1.5"
        >
          {isSimPlaying ? "⏸ Pause Simulator" : "▶ Resume Playback"}
        </button>
        <div className="text-[11px] font-mono text-neutral-500">
          Frame: {currentFrameIndex + 1} / {totalFrames}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-neutral-400">
          <span>Frame Scrubber</span>
          <span>{currentFrameIndex}</span>
        </div>
        <input
          type="range"
          min="0"
          max={totalFrames - 1}
          value={currentFrameIndex}
          onChange={(e) => {
            setIsSimPlaying(false);
            setCurrentFrameIndex(parseInt(e.target.value));
          }}
          className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-neutral-400">
          <span>Simulator Speed</span>
          <span>{simFps} FPS</span>
        </div>
        <input
          type="range"
          min="5"
          max="60"
          value={simFps}
          onChange={(e) => setSimFps(parseInt(e.target.value))}
          className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-neutral-255 dark:border-neutral-800">
        <span className="text-[10px] text-neutral-400 uppercase font-bold">Background Color</span>
        <div className="flex gap-2">
          {["#000000", "#111111", "#444444", "#ffffff"].map((color) => (
            <button
              key={color}
              onClick={() => setCanvasBg(color)}
              className={`w-4 h-4 rounded-full border ${
                canvasBg === color
                  ? "border-cyan-400 scale-110"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Set background color to ${color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SimulatorControls;
