"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";

import { useVideoConverter } from "./hooks/useVideoConverter";
import VideoDropZone   from "./components/VideoDropZone";
import SizeEstimator   from "./components/SizeEstimator";
import SettingsPanel   from "./components/SettingsPanel";
import ProgressPanel   from "./components/ProgressPanel";
import DescPreview     from "./components/DescPreview";

export default function VideoToBootanimPage() {
  // ── Video source
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl,  setVideoUrl]  = useState("");
  const [duration,  setDuration]  = useState(0);

  // ── Settings (defaults tuned for smallest output)
  const [resolution,  setResolution]  = useState("sd");   // 480×854
  const [convFps,     setConvFps]     = useState(12);
  const [loopMode,    setLoopMode]    = useState("intro-loop");
  const [partLoop,    setPartLoop]    = useState(0);
  const [resizeMode,  setResizeMode]  = useState<"cover" | "contain">("cover");
  const [trimStart,   setTrimStart]   = useState(0);
  const [trimEnd,     setTrimEnd]     = useState(0);
  const [loopSplit,   setLoopSplit]   = useState(40);     // 40% intro, 60% loop
  const [dedupe,      setDedupe]      = useState(true);
  const [frameStep,   setFrameStep]   = useState(2);      // every 2nd frame → 6 eff. FPS
  const [smoothing,   setSmoothing]   = useState(0.4);    // subtle PNG blur

  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { progress, convert, cancel } = useVideoConverter(videoRef, canvasRef, videoFile);

  const effectiveFrames = useMemo(() => {
    const dur = Math.max(0, trimEnd - trimStart);
    return Math.max(1, Math.ceil(dur * convFps / frameStep));
  }, [trimEnd, trimStart, convFps, frameStep]);

  // ── File select
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(URL.createObjectURL(file));
    setTrimStart(0);
  };

  const handleVideoLoaded = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration);
    setTrimEnd(v.duration);
  };

  const handleConvert = () => {
    convert({
      resolution, convFps, loopMode, partLoop, resizeMode,
      trimStart, trimEnd, duration, loopSplit,
      dedupe, frameStep, smoothing,
    });
  };

  // ── FAQ schema
  const faqSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best resolution for an Android boot animation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "480×854 (SD) is the sweet spot for most devices — files stay under 5 MB and look sharp. Avoid 1080p which produces 5× larger files with no visible boot quality improvement.",
        },
      },
      {
        "@type": "Question",
        name: "Why must bootanimation.zip be uncompressed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Android's bootloader reads the animation before filesystem decompression libraries are loaded. Only STORE (0%) compression works — this tool enforces it automatically.",
        },
      },
      {
        "@type": "Question",
        name: "How do I install the boot animation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rename the file to bootanimation.zip, copy to /system/media/ using a root file manager, and set permissions to 644 (rw-r--r--).",
        },
      },
    ],
  }), []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 fade-in relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Glows */}
      <div className="absolute top-20 left-10 w-[350px] h-[350px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Header */}
      <section className="mb-12 text-center md:text-left relative z-10">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
          <Link href="/studio" className="text-[10px] font-mono text-neutral-455 dark:text-neutral-500 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 rounded transition-colors uppercase tracking-wider font-extrabold">
            ← Back to Studio
          </Link>
          <span className="text-[10px] font-mono text-cyan-550 dark:text-cyan-400 uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 dark:border-cyan-400/20">
            Advanced Tool
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white mt-2 text-gradient">
          Video → Boot Animation
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-3 max-w-3xl leading-relaxed">
          Convert MP4 / WebM into a root-ready{" "}
          <code className="text-xs bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 px-1 py-0.5 rounded font-mono text-black dark:text-white">
            bootanimation.zip
          </code>
          . Proper Android resolutions, frame dedup, PNG smoothing — outputs stay under 5 MB.
        </p>
      </section>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10 mb-16">

        {/* Left column */}
        <div className="space-y-5 md:col-span-1">
          <VideoDropZone
            videoFile={videoFile}
            videoUrl={videoUrl}
            duration={duration}
            videoRef={videoRef}
            onSelect={handleVideoSelect}
            onLoaded={handleVideoLoaded}
          />

          {videoFile && (
            <SizeEstimator
              resolution={resolution}
              convFps={convFps}
              frameStep={frameStep}
              trimStart={trimStart}
              trimEnd={trimEnd}
              smoothing={smoothing}
            />
          )}

          {videoFile && (
            <DescPreview
              resolution={resolution}
              convFps={convFps}
              loopMode={loopMode}
              partLoop={partLoop}
            />
          )}

          {/* Hidden canvas */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-5">
          <SettingsPanel
            resolution={resolution}     onResolution={setResolution}
            trimStart={trimStart}       trimEnd={trimEnd}
            duration={duration}         onTrimStart={setTrimStart}
            onTrimEnd={setTrimEnd}
            convFps={convFps}           onFps={setConvFps}
            resizeMode={resizeMode}     onResize={setResizeMode}
            loopMode={loopMode}         onLoopMode={setLoopMode}
            partLoop={partLoop}         onPartLoop={setPartLoop}
            loopSplit={loopSplit}       onLoopSplit={setLoopSplit}
            effectiveFrames={effectiveFrames}
            dedupe={dedupe}             onDedupe={setDedupe}
            frameStep={frameStep}       onFrameStep={setFrameStep}
            smoothing={smoothing}       onSmoothing={setSmoothing}
          />

          <div className="glass-panel border rounded-2xl p-6 bg-white/70 dark:bg-neutral-950/70 shadow-sm">
            <ProgressPanel
              progress={progress}
              onCancel={cancel}
              onConvert={handleConvert}
              canConvert={!!videoFile}
            />
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="border-t border-neutral-200 dark:border-neutral-900 pt-16 max-w-4xl mx-auto font-sans leading-relaxed">
        <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight mb-8">
          Android Boot Animation Guide & FAQ
        </h2>
        <div className="space-y-8 text-neutral-800 dark:text-neutral-350">
          {[
            {
              q: "Why is 480×854 recommended over 1080p?",
              a: "At 1080×2400, a single PNG frame averages 800 KB. At 480×854, the same frame is ~90 KB — 9× smaller. Boot animations are shown at system startup for 3–6 seconds. Users see no quality difference, but the ZIP is a fraction of the size.",
            },
            {
              q: "What does 'Skip Duplicate Frames' do?",
              a: "Many videos have near-identical consecutive frames (e.g. slow zooms, fades). Our tool hashes each frame's pixel data and skips any frame that matches the previous one, keeping the animation looking identical but producing far fewer PNG files.",
            },
            {
              q: "What is PNG Smoothing?",
              a: "Before exporting each frame as PNG, we apply a micro-blur (0.4px by default). This reduces high-frequency pixel noise — a major driver of PNG file size — with no visible quality loss on a moving boot sequence. It can reduce file size by 20–40%.",
            },
            {
              q: "Why must bootanimation.zip use STORE mode (uncompressed)?",
              a: "Android's bootloader reads the animation before filesystem decompression libraries are initialized. Only raw block-level reads (STORE compression) work. A deflate-compressed ZIP causes a black screen or bootloop. This tool enforces STORE automatically.",
            },
            {
              q: "How do I flash it to my phone?",
              a: "1. Rename the downloaded file to bootanimation.zip. 2. Using MiXplorer or any root file manager, navigate to /system/media/. 3. Backup the original (rename to .bak). 4. Paste your file and set permissions to 644 (rw-r--r--). 5. Reboot.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="space-y-3">
              <h3 className="text-base font-bold text-neutral-850 dark:text-white">Q: {q}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-4 border-l-2 border-cyan-500">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
