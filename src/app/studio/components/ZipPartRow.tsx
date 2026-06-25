"use client";

interface PartConfig {
  type: string;
  loopCount: number;
  pause: number;
  folder: string;
}

interface ZipPartRowProps {
  part: PartConfig;
  index: number;
  parts: PartConfig[];
  setParts: (p: PartConfig[]) => void;
  folders: string[];
  onRemove: () => void;
}

export function ZipPartRow({
  part,
  index,
  parts,
  setParts,
  folders,
  onRemove,
}: ZipPartRowProps) {
  const updatePart = (field: keyof PartConfig, value: string | number) => {
    const list = [...parts];
    list[index] = { ...list[index], [field]: value };
    setParts(list);
  };

  return (
    <div className="flex items-center gap-3 bg-white/40 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-850 p-4 rounded-xl hover:border-neutral-300 dark:hover:border-neutral-800 transition-colors animate-[fadeIn_0.2s_ease] font-mono">
      <div className="w-16 space-y-1">
        <span className="text-[9px] text-neutral-455 dark:text-neutral-500 uppercase block font-bold">
          Type
        </span>
        <select
          value={part.type}
          onChange={(e) => updatePart("type", e.target.value)}
          className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-755 dark:text-neutral-300 rounded-lg p-1.5 w-full font-mono focus:outline-none transition-colors"
        >
          <option value="p">p</option>
          <option value="c">c</option>
        </select>
      </div>

      <div className="flex-grow space-y-1">
        <span className="text-[9px] text-neutral-455 dark:text-neutral-500 uppercase block font-bold">
          Loops (0=∞)
        </span>
        <input
          type="number"
          value={part.loopCount}
          onChange={(e) => updatePart("loopCount", parseInt(e.target.value) || 0)}
          className="bg-white dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-white rounded-lg p-1.5 w-full font-mono focus:outline-none transition-colors"
        />
      </div>

      <div className="flex-grow space-y-1">
        <span className="text-[9px] text-neutral-455 dark:text-neutral-500 uppercase block font-bold">
          Pause (frames)
        </span>
        <input
          type="number"
          value={part.pause}
          onChange={(e) => updatePart("pause", parseInt(e.target.value) || 0)}
          className="bg-white dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-white rounded-lg p-1.5 w-full font-mono focus:outline-none transition-colors"
        />
      </div>

      <div className="flex-grow space-y-1">
        <span className="text-[9px] text-neutral-455 dark:text-neutral-500 uppercase block font-bold">
          Subfolder
        </span>
        <select
          value={part.folder}
          onChange={(e) => updatePart("folder", e.target.value)}
          className="bg-white dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-755 dark:text-neutral-300 rounded-lg p-1.5 w-full font-mono focus:outline-none transition-colors"
        >
          {folders.length > 0 ? (
            folders.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))
          ) : (
            <option value={part.folder}>{part.folder}</option>
          )}
        </select>
      </div>

      <button
        onClick={onRemove}
        className="text-neutral-405 hover:text-red-400 text-sm mt-3 px-2 font-mono"
      >
        ✕
      </button>
    </div>
  );
}

export default ZipPartRow;
