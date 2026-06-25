"use client";

import Link from "next/link";
import AnimatedThemeToggler from "@/components/AnimatedThemeToggler";

export function Header() {
  return (
    <header className="glass-panel sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group">
            {/* Stacked Layers Logo */}
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500 dark:text-cyan-400 group-hover:scale-105 transition-transform duration-200">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-sm font-black tracking-tight font-sans text-neutral-900 dark:text-white flex items-center">
              <span>BootAnim</span>
              <span className="text-cyan-500 dark:text-cyan-400">Deck</span>
            </span>
          </Link>
          <div className="hidden md:block h-4 w-px bg-neutral-300 dark:bg-neutral-800" />
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/" className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              Gallery
            </Link>
            <Link href="/studio" className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              Studio
            </Link>
            <Link href="/video-to-bootanimation" className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Video to Bootanimation
            </Link>
            <Link href="/bulk-downloader" className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              Bulk Downloader
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/Mr-Hasan-Hamid/bootanimdeck" 
            target="_blank" 
            rel="noreferrer" 
            className="text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center"
            aria-label="GitHub Repository"
          >
            <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
          <AnimatedThemeToggler />
          <Link href="/studio" className="bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm">
            Launch Studio
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
