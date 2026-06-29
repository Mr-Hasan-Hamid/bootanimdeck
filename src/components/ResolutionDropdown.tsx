"use client";

import { useState, useRef, useEffect } from "react";

export interface ResolutionOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface ResolutionDropdownProps {
  value: string;
  onChange: (v: string) => void;
  originalWidth?: number;
  originalHeight?: number;
  disabled?: boolean;
  direction?: "top" | "bottom";
}

export function ResolutionDropdown({
  value,
  onChange,
  originalWidth,
  originalHeight,
  disabled = false,
  direction = "top",
}: ResolutionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const options: ResolutionOption[] = [
    { 
      value: "original", 
      label: "Original Resolution", 
      sublabel: originalWidth && originalHeight ? `${originalWidth}x${originalHeight}` : "Varies per file" 
    },
    { value: "1080x2400", label: "1080 x 2400", sublabel: "FHD+ Tall / Modern" },
    { value: "1080x1920", label: "1080 x 1920", sublabel: "FHD Standard 16:9" },
    { value: "720x1600", label: "720 x 1600", sublabel: "HD+ Tall" },
    { value: "720x1280", label: "720 x 1280", sublabel: "HD Standard 16:9" },
    { value: "1440x3200", label: "1440 x 3200", sublabel: "QHD+ Premium" },
    { value: "custom", label: "Custom Resolution", sublabel: "Specify size..." },
  ];

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 rounded-xl px-4 py-2.5 hover:border-neutral-350 dark:hover:border-neutral-750 transition-all focus:outline-none disabled:opacity-50 font-sans cursor-pointer shadow-sm active:scale-[0.99]"
      >
        <div className="flex flex-col items-start truncate leading-tight">
          <span className="font-bold text-neutral-900 dark:text-white truncate">{selectedOption.label}</span>
          {selectedOption.sublabel && (
            <span className="text-[9px] text-neutral-450 dark:text-neutral-500 font-mono mt-0.5">
              {selectedOption.sublabel}
            </span>
          )}
        </div>
        <span className="text-neutral-400 dark:text-neutral-500 shrink-0 text-[10px]">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-55 bg-white dark:bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden py-1 max-h-64 overflow-y-auto animate-[fadeIn_0.15s_ease-out] ${
            direction === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between border-none outline-none ${
                value === opt.value
                  ? "bg-neutral-50 dark:bg-neutral-900 text-cyan-600 dark:text-cyan-400 font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
              }`}
            >
              <div className="flex flex-col leading-tight">
                <span className="font-semibold">{opt.label}</span>
                {opt.sublabel && (
                  <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
                    {opt.sublabel}
                  </span>
                )}
              </div>
              {value === opt.value && <span className="text-cyan-500 font-mono text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResolutionDropdown;
