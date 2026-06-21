import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import AnimatedThemeToggler from "@/components/AnimatedThemeToggler";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Android Boot Animation Studio & Gallery",
  description: "Explore 220+ Android boot animations in high-quality previews. Parse desc.txt configuration, adjust speed and loop parameters, download root-ready ZIPs, or create your own animations client-side.",
  keywords: ["Android", "Boot Animation", "Gallery", "Custom ROMs", "desc.txt", "Vercel Theme", "GIF Preview", "Android Customization"],
  authors: [{ name: "Android Theme Studio" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-white dark:bg-black text-black dark:text-white transition-colors duration-300`}>
        {/* Vercel Header */}
        <header className="glass-panel sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group">
                {/* Stacked Layers Logo */}
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500 dark:text-cyan-400 group-hover:scale-105 transition-transform duration-200">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="text-sm font-black tracking-tight font-sans text-neutral-900 dark:text-white flex items-center">
                  <span>Boot</span>
                  <span className="text-cyan-550 dark:text-cyan-400">Forge</span>
                </span>
              </Link>
              <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-800" />
              <nav className="flex items-center gap-5">
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
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com" 
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

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full bg-neutral-50 dark:bg-black py-12 px-6 border-t border-neutral-100 dark:border-neutral-900" style={{ borderTopWidth: "1px" }}>
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 dark:text-neutral-600">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="text-xs font-bold tracking-tight text-neutral-450 dark:text-neutral-600 font-sans flex items-center">
                  <span>Boot</span>
                  <span className="text-neutral-500 dark:text-neutral-550">Forge</span>
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-600">
                A premium, open-source preview dashboard for Android boot animators.
              </p>
            </div>
            <div className="flex gap-6 text-xs text-neutral-400 dark:text-neutral-600">
              <span>224 Themes Loaded</span>
              <span>•</span>
              <span>100% Client-Side Compiler</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
