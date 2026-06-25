"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import type JSZip from "jszip";

interface PartConfig {
  type: string;
  loopCount: number;
  pause: number;
  folder: string;
}

export function useZipPreview(
  loadedZip: JSZip | null,
  parts: PartConfig[],
  fps: number,
  width: number,
  height: number,
  zipCanvasRef: RefObject<HTMLCanvasElement>
) {
  const [zipPreviewActive, setZipPreviewActive] = useState(false);
  const [zipPreviewLoading, setZipPreviewLoading] = useState(false);
  const [zipPreviewPlaying, setZipPreviewPlaying] = useState(false);
  const [zipPreviewTotalFrames, setZipPreviewTotalFrames] = useState(0);
  const [zipPreviewCurrentFrame, setZipPreviewCurrentFrame] = useState(0);

  const zipPreviewFramesRef = useRef<
    { folder: string; name: string; blobUrl: string; img: HTMLImageElement | null }[]
  >([]);
  const zipPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupZipPreview = () => {
    if (zipPlayIntervalRef.current) clearInterval(zipPlayIntervalRef.current);
    zipPreviewFramesRef.current.forEach((f) => {
      if (f.blobUrl) URL.revokeObjectURL(f.blobUrl);
    });
    zipPreviewFramesRef.current = [];
    setZipPreviewActive(false);
    setZipPreviewPlaying(false);
    setZipPreviewCurrentFrame(0);
    setZipPreviewTotalFrames(0);
  };

  const playZipPreview = (
    framesList: { folder: string; name: string; blobUrl: string; img: HTMLImageElement | null }[],
    targetFps: number
  ) => {
    if (zipPlayIntervalRef.current) clearInterval(zipPlayIntervalRef.current);

    let currentIdx = 0;
    const interval = 1000 / targetFps;

    setZipPreviewPlaying(true);

    zipPlayIntervalRef.current = setInterval(() => {
      const canvas = zipCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (framesList.length === 0) return;

      const frame = framesList[currentIdx];
      if (frame && frame.img) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const imgRatio = frame.img.width / frame.img.height;
        const canvasRatio = canvas.width / canvas.height;
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

        ctx.drawImage(frame.img, drawX, drawY, drawWidth, drawHeight);
      }

      setZipPreviewCurrentFrame(currentIdx);
      currentIdx = (currentIdx + 1) % framesList.length;
    }, interval);
  };

  const prepareZipPreview = async () => {
    if (!loadedZip) return;
    setZipPreviewLoading(true);
    setZipPreviewActive(true);
    setZipPreviewPlaying(false);
    setZipPreviewCurrentFrame(0);
    if (zipPlayIntervalRef.current) clearInterval(zipPlayIntervalRef.current);

    zipPreviewFramesRef.current.forEach((f) => {
      if (f.blobUrl) URL.revokeObjectURL(f.blobUrl);
    });
    zipPreviewFramesRef.current = [];

    try {
      const tempFrames: { folder: string; name: string; file: JSZip.JSZipObject }[] = [];

      for (const part of parts) {
        const folderName = part.folder;
        const filesInFolder = Object.keys(loadedZip.files).filter(
          (filePath) =>
            filePath.startsWith(`${folderName}/`) &&
            !loadedZip.files[filePath].dir &&
            /\.(png|jpg|jpeg)$/i.test(filePath)
        );

        filesInFolder.sort();

        filesInFolder.forEach((filePath) => {
          const fileObj = loadedZip.file(filePath);
          if (fileObj) {
            tempFrames.push({
              folder: folderName,
              name: filePath,
              file: fileObj,
            });
          }
        });
      }

      if (tempFrames.length === 0) {
        alert("No image frames found in the zip matching the parts configuration.");
        setZipPreviewLoading(false);
        setZipPreviewActive(false);
        return;
      }

      setZipPreviewTotalFrames(tempFrames.length);

      const loadedFrames = await Promise.all(
        tempFrames.map(async (tf) => {
          const blob = await tf.file.async("blob");
          const blobUrl = URL.createObjectURL(blob);

          const img = new Image();
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = blobUrl;
          });

          return {
            folder: tf.folder,
            name: tf.name,
            blobUrl,
            img,
          };
        })
      );

      zipPreviewFramesRef.current = loadedFrames;
      setZipPreviewLoading(false);
      playZipPreview(loadedFrames, fps);
    } catch (e) {
      console.error("Failed to load ZIP preview:", e);
      alert("Error generating live preview.");
      setZipPreviewLoading(false);
      setZipPreviewActive(false);
    }
  };

  const toggleZipPreviewPlayback = () => {
    if (zipPreviewPlaying) {
      if (zipPlayIntervalRef.current) clearInterval(zipPlayIntervalRef.current);
      setZipPreviewPlaying(false);
    } else {
      playZipPreview(zipPreviewFramesRef.current, fps);
    }
  };

  useEffect(() => {
    return () => {
      if (zipPlayIntervalRef.current) clearInterval(zipPlayIntervalRef.current);
      zipPreviewFramesRef.current.forEach((f) => {
        if (f.blobUrl) URL.revokeObjectURL(f.blobUrl);
      });
    };
  }, []);

  return {
    zipPreviewActive,
    zipPreviewLoading,
    zipPreviewPlaying,
    zipPreviewTotalFrames,
    zipPreviewCurrentFrame,
    prepareZipPreview,
    toggleZipPreviewPlayback,
    cleanupZipPreview,
  };
}
