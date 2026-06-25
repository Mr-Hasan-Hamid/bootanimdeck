"use client";

interface SelectionControlsProps {
  matchingCount: number;
  selectedCount: number;
  onSelectAll: () => void;
  onInvert: () => void;
  onClear: () => void;
}

export function SelectionControls({
  matchingCount,
  selectedCount,
  onSelectAll,
  onInvert,
  onClear,
}: SelectionControlsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={onSelectAll}
        className="px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-[10px] font-bold uppercase tracking-wider transition-colors"
      >
        Select All Matching ({matchingCount})
      </button>
      <button
        onClick={onInvert}
        className="px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-[10px] font-bold uppercase tracking-wider transition-colors"
      >
        Invert Selection
      </button>
      {selectedCount > 0 && (
        <button
          onClick={onClear}
          className="px-3.5 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-red-500 text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          Clear Selection ({selectedCount})
        </button>
      )}
    </div>
  );
}
export default SelectionControls;
