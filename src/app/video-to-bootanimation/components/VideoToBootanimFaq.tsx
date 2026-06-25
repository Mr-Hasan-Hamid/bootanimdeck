"use client";

import { useMemo } from "react";

export default function VideoToBootanimFaq() {
  const faqSchema = useMemo(
    () => ({
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
    }),
    []
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
              <h3 className="text-base font-bold text-neutral-850 dark:text-white font-mono uppercase">
                Q: {q}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-4 border-l-2 border-cyan-500">
                {a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
