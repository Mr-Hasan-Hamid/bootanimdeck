"use client";

import React from "react";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
}

export function ShimmerButton({ active, children, className = "", ...props }: ShimmerButtonProps) {
  return (
    <button
      className={`relative overflow-hidden px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border outline-none select-none ${
        active
          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md scale-102"
          : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-450 hover:text-black dark:hover:text-white"
      } ${className}`}
      {...props}
    >
      {/* Background Shimmer element */}
      <span className="absolute inset-0 block w-full h-full pointer-events-none">
        <span className="absolute inset-0 block w-full h-full animate-shimmer bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.15)_40%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0)_60%)] dark:bg-[linear-gradient(120deg,rgba(255,255,255,0)_30%,rgba(255,255,255,0.08)_40%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0)_60%)]" />
      </span>

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-1.5">
        {children}
      </span>
    </button>
  );
}

export default ShimmerButton;
