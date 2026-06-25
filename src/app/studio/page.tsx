"use client";

import { useState } from "react";
import Link from "next/link";
import ZipEditorTab from "./components/ZipEditorTab";
import VideoConverterTab from "./components/VideoConverterTab";
import InstallerTab from "./components/InstallerTab";

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<"editor" | "converter" | "installer">("editor");

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 fade-in relative min-h-screen">
      {/* Background ambient glows */}
      <div className="absolute top-20 left-10 w-[350px] h-[350px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Header Banner */}
      <section className="mb-10 text-center md:text-left relative z-10">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
          <Link
            href="/"
            className="text-[10px] font-mono text-neutral-455 dark:text-neutral-500 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-800 px-2.5 py-0.5 rounded transition-colors uppercase tracking-wider font-extrabold"
          >
            ← Back to Gallery
          </Link>
          <span className="text-[10px] font-mono text-purple-650 dark:text-purple-400 uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/20 dark:border-purple-400/20">
            Developer Tooling
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white mt-2 text-gradient">
          Android Customizer Studio
        </h1>
        <p className="text-neutral-555 dark:text-neutral-450 text-sm mt-3 max-w-3xl leading-relaxed">
          Create, edit, validate, and compile flashable android boot sequences entirely in browser.
        </p>
      </section>

      {/* Tab Navigation */}
      <div className="flex items-center justify-center md:justify-start border-b border-neutral-200 dark:border-neutral-900 mb-8 relative z-10 font-mono text-xs overflow-x-auto whitespace-nowrap">
        {[
          { id: "editor", label: "ZIP Configuration Editor" },
          { id: "converter", label: "Video → ZIP Converter" },
          { id: "installer", label: "ADB Installer Guide" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "editor" | "converter" | "installer")}
            className={`py-3 px-6 font-bold transition-all relative ${
              activeTab === tab.id
                ? "text-cyan-555 dark:text-cyan-400 border-b-2 border-cyan-555 dark:border-cyan-400"
                : "text-neutral-455 hover:text-neutral-700 dark:hover:text-neutral-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="relative z-10 font-mono">
        {activeTab === "editor" && <ZipEditorTab />}
        {activeTab === "converter" && <VideoConverterTab />}
        {activeTab === "installer" && <InstallerTab />}
      </div>
    </div>
  );
}
