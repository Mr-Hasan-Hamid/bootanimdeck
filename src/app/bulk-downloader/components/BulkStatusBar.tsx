"use client";

interface BulkStatusBarProps {
  selectedCount: number;
  totalCount: number;
  totalSizeFormatted: string;
  downloading: boolean;
  statusText: string;
  progressPercent: number;
  downloadErrors: string[];
  onCancel: () => void;
  onClear: () => void;
  onDownload: () => void;
}

export function BulkStatusBar({
  selectedCount,
  totalCount,
  totalSizeFormatted,
  downloading,
  statusText,
  progressPercent,
  downloadErrors,
  onCancel,
  onClear,
  onDownload
}: BulkStatusBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/90 dark:bg-black/95 border-t border-neutral-850 backdrop-blur-md px-6 py-5 shadow-2xl transition-all duration-300 slide-in-bottom">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        {/* Status Information */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-6 text-center sm:text-left">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase block tracking-wider">Animations Selected</span>
            <span className="text-sm font-bold text-white">
              {selectedCount} <span className="text-neutral-500">/ {totalCount}</span>
            </span>
          </div>
          <div className="hidden sm:block h-8 w-px bg-neutral-800 self-center" />
          <div>
            <span className="text-[10px] text-neutral-500 uppercase block tracking-wider">Estimated Package Size</span>
            <span className="text-sm font-bold text-cyan-400">{totalSizeFormatted}</span>
          </div>
        </div>

        {/* Action Bar / Progress Monitor */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {downloading ? (
            <div className="flex items-center gap-4 w-full sm:w-80">
              <div className="flex-grow">
                <div className="flex justify-between text-[10px] text-neutral-400 mb-1 leading-none">
                  <span className="truncate max-w-[180px]" title={statusText}>{statusText}</span>
                  <span className="font-bold text-cyan-400">{progressPercent}%</span>
                </div>
                <div className="w-full bg-neutral-850 h-2 rounded-full overflow-hidden border border-neutral-800">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <button
                onClick={onCancel}
                className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-850 text-red-500 hover:bg-neutral-800 hover:text-red-450 transition-colors shrink-0 text-[10px] font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={onClear}
                className="px-4 py-3 rounded-xl border border-neutral-800 hover:bg-neutral-800 text-[11px] text-neutral-400 font-bold uppercase tracking-wider transition-colors w-1/3 sm:w-auto"
              >
                Clear
              </button>
              <button
                onClick={onDownload}
                className="flex-grow sm:flex-grow-0 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-[11px] uppercase tracking-widest transition-all duration-300 shadow-md shadow-cyan-500/20 active:scale-98 animate-pulse hover:animate-none flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download Package (.zip)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error notifications */}
      {downloadErrors.length > 0 && (
        <div className="mx-auto max-w-7xl mt-3 p-3 bg-red-950/40 border border-red-900/60 rounded-lg text-[9px] font-mono text-red-400 space-y-1 max-h-16 overflow-y-auto">
          <span className="font-bold block uppercase tracking-wide">Warning: The following files failed to download and were excluded from the archive:</span>
          {downloadErrors.map((err, i) => (
            <div key={i}>• {err}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BulkStatusBar;
