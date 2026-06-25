"use client";

import { useState, useEffect } from "react";

interface DrawerPreviewProps {
  gifUrl: string;
  coverUrl: string;
  alt: string;
}

export default function DrawerPreview({ gifUrl, coverUrl, alt }: DrawerPreviewProps) {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const webmUrl = gifUrl ? gifUrl.replace(/\.gif$/, ".webm") : null;

  useEffect(() => {
    setMediaLoaded(false);
    setUseFallback(false);
  }, [gifUrl]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
      {/* Static Cover */}
      {coverUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={coverUrl}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
            mediaLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      {/* WebM Video Player */}
      {webmUrl && !useFallback && (
        <video
          src={webmUrl}
          loop
          muted
          playsInline
          autoPlay
          onPlay={() => setMediaLoaded(true)}
          onError={() => setUseFallback(true)}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
            mediaLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Fallback GIF Player */}
      {(!webmUrl || useFallback) && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={gifUrl}
          alt={alt}
          onLoad={() => setMediaLoaded(true)}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
            mediaLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Loader Spinner Overlay */}
      {!mediaLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-2.5">
            <svg className="animate-spin h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold animate-pulse">
              Buffering Preview...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
