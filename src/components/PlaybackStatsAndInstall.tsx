"use client";

import { useState } from "react";
import { AnimationItem } from "@/types/animation";
import DescTxtViewer from "./DescTxtViewer";

interface PlaybackStatsAndInstallProps {
  selectedAnim: AnimationItem;
}

export default function PlaybackStatsAndInstall({ selectedAnim }: PlaybackStatsAndInstallProps) {
  const [copiedAdb, setCopiedAdb] = useState(false);

  const handleCopyAdb = () => {
    navigator.clipboard.writeText(
      `adb push "${selectedAnim.zipName}" /system/media/bootanimation.zip\nadb shell chmod 644 /system/media/bootanimation.zip`
    );
    setCopiedAdb(true);
    setTimeout(() => setCopiedAdb(false), 2000);
  };

  return (
    <div className="space-y-8 font-mono">
      <DescTxtViewer selectedAnim={selectedAnim} />

      {/* Animation Statistics */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold font-mono tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
          Animation Statistics
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Target Resolution
            </span>
            <span className="text-sm font-bold text-neutral-800 dark:text-white mt-1 font-mono">
              {selectedAnim.width} × {selectedAnim.height}{" "}
              <span className="text-[10px] text-neutral-450 dark:text-neutral-500 font-normal">
                px
              </span>
            </span>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Target Frame Rate
            </span>
            <span className="text-sm font-bold text-neutral-800 dark:text-white mt-1 font-mono">
              {selectedAnim.fps}{" "}
              <span className="text-[10px] text-neutral-455 dark:text-neutral-500 font-normal">
                frames/sec
              </span>
            </span>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Zip File Size
            </span>
            <span className="text-sm font-bold text-neutral-800 dark:text-white mt-1 font-mono">
              {selectedAnim.sizeFormatted}
            </span>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Animation Structure
            </span>
            <span className="text-sm font-bold text-neutral-800 dark:text-white mt-1 font-mono">
              {selectedAnim.parts.length}{" "}
              <span className="text-[10px] text-neutral-455 dark:text-neutral-500 font-normal">
                {selectedAnim.parts.length === 1 ? "part" : "parts"}
              </span>
            </span>
          </div>
        </div>

        <div className="bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-150 dark:border-neutral-850 rounded-xl p-3.5 space-y-2">
          <span className="text-[10px] font-mono text-neutral-455 dark:text-neutral-500 uppercase tracking-wider block">
            Parts Detailed Breakdown
          </span>
          <div className="space-y-1.5">
            {selectedAnim.parts.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-405 border-b border-dashed border-neutral-200 dark:border-neutral-800/80 pb-1.5 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>
                    Part Folder:{" "}
                    <code className="text-cyan-550 dark:text-cyan-400 font-mono font-bold">
                      {p.folder}
                    </code>
                  </span>
                </div>
                <span className="font-mono text-[11px]">
                  loops {p.loopCount === 0 ? "∞" : p.loopCount}x • pause {p.pause}f
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADB Installation Commands */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-semibold font-mono tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
            ADB Installation Push
          </h3>
          <span className="text-[10px] font-mono text-yellow-500/90 dark:text-yellow-400/80 px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20">
            Requires Root
          </span>
        </div>
        <div className="bg-[#0b0c10] border border-neutral-800 rounded-xl overflow-hidden shadow-lg relative group">
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-900 bg-[#0d0e12]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-[10px] font-mono text-neutral-500">adb-install.sh</span>
            <button
              onClick={handleCopyAdb}
              className="text-[10px] font-mono text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-2.5 py-1 rounded transition-all flex items-center gap-1"
            >
              {copiedAdb ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-3 h-3 text-emerald-400"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.588M16.5 7.75v10.5a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25V7.75a2.25 2.25 0 012.25-2.25h9a2.25 2.25 0 012.25 2.25z"
                    />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-neutral-300">
            <span className="text-neutral-500 font-semibold">$</span>{" "}
            <span className="text-purple-400">adb</span> root{"\n"}
            <span className="text-neutral-500 font-semibold">$</span>{" "}
            <span className="text-purple-400">adb</span> push &ldquo;{selectedAnim.zipName}&rdquo;
            /system/media/bootanimation.zip{"\n"}
            <span className="text-neutral-500 font-semibold">$</span>{" "}
            <span className="text-purple-400">adb</span> shell chmod 644
            /system/media/bootanimation.zip
          </div>
        </div>
      </div>
    </div>
  );
}
