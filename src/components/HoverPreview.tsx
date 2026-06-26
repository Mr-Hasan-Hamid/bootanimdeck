"use client";

import { useState, useEffect, useRef } from "react";

interface HoverPreviewProps {
  gifUrl: string | null;
  coverUrl: string | null;
  alt: string;
  objectCover?: boolean;
}

export function HoverPreview({
  gifUrl,
  coverUrl,
  alt,
  objectCover = false,
}: HoverPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const webmUrl = gifUrl ? gifUrl.replace(/\.gif$/, ".webm") : null;

  // Start preloading when card enters viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !webmUrl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // only need to trigger once
        }
      },
      { rootMargin: "200px" } // start loading 200px before card is visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [webmUrl]);

  // Play/pause based on hover - no mounting delay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovered && videoReady) {
      video.currentTime = 0;
      video.play().catch(() => setUseFallback(true));
    } else {
      video.pause();
    }
  }, [isHovered, videoReady]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Static Cover Image — always visible until video is playing */}
      {coverUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={coverUrl}
          alt={alt}
          loading="lazy"
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
            objectCover ? "object-cover" : "object-contain"
          } ${isHovered && videoReady && !useFallback ? "opacity-0" : "opacity-100"}`}
        />
      )}

      {/* 2. WebM — pre-mounted when in viewport, always in DOM, just hidden/paused */}
      {inView && webmUrl && !useFallback && (
        <video
          ref={videoRef}
          src={webmUrl}
          loop
          muted
          playsInline
          preload="auto"
          onCanPlayThrough={() => setVideoReady(true)}
          onError={() => setUseFallback(true)}
          className={`absolute inset-0 w-full h-full transition-opacity duration-200 ${
            objectCover ? "object-cover" : "object-contain"
          } ${isHovered && videoReady ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* 3. GIF fallback — only if WebM errors */}
      {isHovered && gifUrl && useFallback && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={gifUrl}
          alt={`${alt} preview`}
          className={`absolute inset-0 w-full h-full ${
            objectCover ? "object-cover" : "object-contain"
          } opacity-100`}
        />
      )}

      {/* 4. Subtle "buffering" dot — only shows if video isn't ready yet on hover */}
      {isHovered && !videoReady && !useFallback && (
        <div className="absolute bottom-2 right-2 z-10 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
      )}
    </div>
  );
}

export default HoverPreview;
