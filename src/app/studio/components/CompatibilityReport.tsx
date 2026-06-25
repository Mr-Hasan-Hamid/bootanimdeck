"use client";

interface CompatibilityReportProps {
  lintErrors: string[];
  lintWarnings: string[];
}

export function CompatibilityReport({ lintErrors, lintWarnings }: CompatibilityReportProps) {
  const hasErrors = lintErrors.length > 0;
  const hasWarnings = lintWarnings.length > 0;

  return (
    <div className="text-xs space-y-2 border border-neutral-200 dark:border-neutral-850 bg-white/40 dark:bg-black/40 p-4 rounded-xl font-mono">
      <div className="flex justify-between items-center mb-1">
        <span className="font-extrabold text-neutral-450 dark:text-neutral-500 uppercase tracking-widest text-[9px]">
          🔍 Compatibility Report
        </span>
        {hasErrors ? (
          <span className="text-red-500 font-bold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
            ❌ FAILED ({lintErrors.length} errors)
          </span>
        ) : hasWarnings ? (
          <span className="text-yellow-600 dark:text-yellow-500 font-bold bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">
            ⚠️ WARNINGS ({lintWarnings.length} warnings)
          </span>
        ) : (
          <span className="text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            ✅ VERIFIED COMPATIBLE
          </span>
        )}
      </div>

      {!hasErrors && !hasWarnings ? (
        <div className="text-neutral-500 dark:text-neutral-450 text-[11px] leading-relaxed">
          This package is properly formatted and will play correctly on standard Android ROM devices.
        </div>
      ) : (
        <div className="space-y-1.5 text-[11px] max-h-36 overflow-y-auto pr-2 leading-relaxed">
          {lintErrors.map((err, idx) => (
            <div key={`err-${idx}`} className="text-red-405">
              • [ERROR] {err}
            </div>
          ))}
          {lintWarnings.map((warn, idx) => (
            <div key={`warn-${idx}`} className="text-yellow-500">
              • [WARN] {warn}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CompatibilityReport;
