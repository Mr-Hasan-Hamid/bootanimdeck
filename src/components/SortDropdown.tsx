"use client";

import { useRef, useEffect } from "react";

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  sortBy: string;
  setSortBy: (v: string) => void;
  sortOpen: boolean;
  setSortOpen: (v: boolean) => void;
  options: SortOption[];
  activeSortLabel: string;
}

export function SortDropdown({
  sortBy,
  setSortBy,
  sortOpen,
  setSortOpen,
  options,
  activeSortLabel,
}: SortDropdownProps) {
  const sortDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSortOpen]);

  return (
    <div className="relative" ref={sortDropdownRef}>
      <button
        onClick={() => setSortOpen(!sortOpen)}
        className="flex items-center justify-between gap-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 rounded-xl px-4 py-3 font-semibold hover:border-neutral-350 dark:hover:border-neutral-700 transition-colors focus:outline-none w-48"
      >
        <span className="text-neutral-400 dark:text-neutral-500 font-mono">SORT:</span>
        <span className="truncate">{activeSortLabel}</span>
        <span className="text-neutral-400">▾</span>
      </button>

      {sortOpen && (
        <div className="absolute right-0 mt-2 z-20 w-48 bg-white dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg overflow-hidden py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSortBy(opt.value);
                setSortOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between ${
                sortBy === opt.value
                  ? "bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
              }`}
            >
              <span>{opt.label}</span>
              {sortBy === opt.value && <span className="text-cyan-500">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SortDropdown;
