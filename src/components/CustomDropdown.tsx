"use client";

import { useState, useRef, useEffect } from "react";

interface Option<T> {
  value: T;
  label: string;
}

interface CustomDropdownProps<T> {
  label?: string;
  value: T;
  options: Option<T>[];
  onChange: (val: T) => void;
  className?: string;
}

export default function CustomDropdown<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className = "",
}: CustomDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 rounded-xl px-3.5 py-3 font-semibold hover:border-neutral-300 dark:hover:border-neutral-700 transition-all focus:outline-none w-full shadow-sm"
      >
        <div className="flex items-center gap-1.5 truncate">
          {label && (
            <span className="text-neutral-455 dark:text-neutral-500 font-mono uppercase text-[10px]">
              {label}:
            </span>
          )}
          <span className="truncate">{activeOption ? activeOption.label : String(value)}</span>
        </div>
        <span className="text-neutral-400 dark:text-neutral-600 text-xs select-none">▼</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 z-30 w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg overflow-y-auto max-h-60 py-1 animate-[fadeIn_0.1s_ease] scrollbar-none">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between ${
                value === opt.value
                  ? "bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
              }`}
            >
              <span>{opt.label}</span>
              {value === opt.value && (
                <span className="text-cyan-555 dark:text-cyan-400 font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
