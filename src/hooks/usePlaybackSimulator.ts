"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import { AnimationItem } from "@/types/animation";

export function usePlaybackSimulator(
  selectedAnim: AnimationItem | null,
  canvasRef: RefObject<HTMLCanvasElement | null>
) {
  const [simActive, setSimActive] = useState(false);
  const [frames, setFrames] = useState<string[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [simFps, setSimFps] = useState(30);
  const [loadingFrames, setLoadingFrames] = useState(false);
  const [canvasBg, setCanvasBg] = useState("#000000");
  const [isSimPlaying, setIsSimPlaying] = useState(false);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);

  const simIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSimActive(false);
    setIsSimPlaying(false);
    setFrames([]);
    setLoadedImages([]);
    setCurrentFrameIndex(0);
    if (selectedAnim) setSimFps(selectedAnim.fps || 30);
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
  }, [selectedAnim]);

  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  const startFrameSimulator = async () => {
    if (!selectedAnim) return;
    setLoadingFrames(true);
    setSimActive(true);
    try {
      const allFrames: string[] = [];
      const r2BaseUrl =
        process.env.NEXT_PUBLIC_R2_BASE_URL ||
        (selectedAnim.zipUrl ? selectedAnim.zipUrl.split("/source-zips/")[0] : "");

      if (r2BaseUrl) {
        const folder = encodeURIComponent(selectedAnim.folderName);
        const manifestUrl = `${r2BaseUrl}/extracted/${folder}/manifest.json`;
        const res = await fetch(manifestUrl);
        if (!res.ok) throw new Error(`R2 manifest fetch failed: ${res.status}`);
        const manifest: Record<string, string[]> = await res.json();
        const sortedParts = Object.entries(manifest).sort(([a], [b]) =>
          a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
        );
        sortedParts.forEach(([partName, files]) => {
          files.forEach((f) => allFrames.push(`${r2BaseUrl}/extracted/${folder}/${partName}/${f}`));
        });
      } else {
        const res = await fetch(`/api/frames?folder=${encodeURIComponent(selectedAnim.folderName)}`);
        const result = await res.json();
        if (result.parts && result.parts.length > 0) {
          result.parts.forEach((p: { frames: string[] }) => allFrames.push(...p.frames));
        }
      }

      if (allFrames.length > 0) {
        setFrames(allFrames);
        const imgPromises = allFrames.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = () => reject();
              img.src = src;
            })
        );
        const imgs = await Promise.all(imgPromises);
        setLoadedImages(imgs);
        setCurrentFrameIndex(0);
        setIsSimPlaying(true);
      } else {
        alert("No frame sequences found for this animation.");
        setSimActive(false);
      }
    } catch (e) {
      console.warn("Direct R2 fetch failed, falling back to Vercel API proxy:", e);
      try {
        const res = await fetch(`/api/frames?folder=${encodeURIComponent(selectedAnim.folderName)}`);
        const result = await res.json();
        if (result.parts && result.parts.length > 0) {
          const allFrames: string[] = [];
          result.parts.forEach((p: { frames: string[] }) => allFrames.push(...p.frames));
          setFrames(allFrames);
          const imgPromises = allFrames.map(
            (src) =>
              new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject();
                img.src = src;
              })
          );
          const imgs = await Promise.all(imgPromises);
          setLoadedImages(imgs);
          setCurrentFrameIndex(0);
          setIsSimPlaying(true);
          return;
        }
      } catch (fallbackError) {
        console.error("Vercel API fallback failed:", fallbackError);
      }
      alert("Failed to load sequential frame files.");
      setSimActive(false);
    } finally {
      setLoadingFrames(false);
    }
  };

  useEffect(() => {
    if (!simActive || loadedImages.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = loadedImages[currentFrameIndex];
    if (!img) return;

    ctx.fillStyle = canvasBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let drawX = 0;
    let drawY = 0;

    if (imgRatio > canvasRatio) {
      drawHeight = canvas.width / imgRatio;
      drawY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      drawX = (canvas.width - drawWidth) / 2;
    }
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, [currentFrameIndex, loadedImages, simActive, canvasBg, canvasRef]);

  useEffect(() => {
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    if (!simActive || !isSimPlaying || loadedImages.length === 0) return;
    const delay = 1000 / simFps;
    simIntervalRef.current = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % loadedImages.length);
    }, delay);
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, [simActive, isSimPlaying, loadedImages, simFps]);

  const toggleSimPlayback = () => setIsSimPlaying((prev) => !prev);

  return {
    simActive,
    frames,
    currentFrameIndex,
    setCurrentFrameIndex,
    simFps,
    setSimFps,
    loadingFrames,
    canvasBg,
    setCanvasBg,
    isSimPlaying,
    setIsSimPlaying,
    startFrameSimulator,
    toggleSimPlayback,
  };
}
