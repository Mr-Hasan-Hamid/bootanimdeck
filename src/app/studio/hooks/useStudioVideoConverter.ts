"use client";

import { useState, useEffect, RefObject } from "react";

export function useStudioVideoConverter(
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>
) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [convWidth, setConvWidth] = useState(1080);
  const [convHeight, setConvHeight] = useState(2400);
  const [convFps, setConvFps] = useState(30);
  const [convLoop, setConvLoop] = useState(0); // 0 = Infinite, 1 = Once
  const [convStatus, setConvStatus] = useState<
    "idle" | "rendering" | "compiling" | "done" | "error"
  >("idle");
  const [convProgress, setConvProgress] = useState(0);
  const [convCurrentFrame, setConvCurrentFrame] = useState(0);
  const [convTotalFrames, setConvTotalFrames] = useState(0);

  // Clean up video object URL
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(URL.createObjectURL(file));
    setConvStatus("idle");
    setConvProgress(0);
  };

  const processVideoToBootanim = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !videoFile) {
      alert("Please select a video file first.");
      return;
    }

    setConvStatus("rendering");
    setConvProgress(0);

    const duration = video.duration;
    const interval = 1 / convFps;
    const totalFrames = Math.floor(duration * convFps);
    setConvTotalFrames(totalFrames);
    setConvCurrentFrame(0);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setConvStatus("error");
      return;
    }

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    let frameIndex = 0;
    let time = 0;

    const captureNextFrame = async (): Promise<void> => {
      if (time >= duration || frameIndex >= totalFrames) {
        setConvStatus("compiling");

        let descContent = `${convWidth} ${convHeight} ${convFps}\n`;
        descContent += `p ${convLoop} 0 part0\n`;
        zip.file("desc.txt", descContent);

        try {
          const zipBlob = await zip.generateAsync({
            type: "blob",
            compression: "STORE",
          });

          const downloadUrl = URL.createObjectURL(zipBlob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          const cleanName =
            videoFile.name.substring(0, videoFile.name.lastIndexOf(".")) || "custom";
          a.download = `${cleanName}_bootanimation.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);

          setConvStatus("done");
          setConvProgress(100);
        } catch (e) {
          console.error(e);
          setConvStatus("error");
        }
        return;
      }

      video.currentTime = time;

      return new Promise<void>((resolve) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);

          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, convWidth, convHeight);

          const videoRatio = video.videoWidth / video.videoHeight;
          const canvasRatio = convWidth / convHeight;
          let drawWidth = convWidth;
          let drawHeight = convHeight;
          let drawX = 0;
          let drawY = 0;

          if (videoRatio > canvasRatio) {
            drawHeight = convWidth / videoRatio;
            drawY = (convHeight - drawHeight) / 2;
          } else {
            drawWidth = convHeight * videoRatio;
            drawX = (convWidth - drawWidth) / 2;
          }

          ctx.drawImage(video, drawX, drawY, drawWidth, drawHeight);

          canvas.toBlob((blob) => {
            if (blob) {
              const frameName = `part0/frame_${frameIndex.toString().padStart(5, "0")}.png`;
              zip.file(frameName, blob);
            }

            frameIndex++;
            setConvCurrentFrame(frameIndex);
            setConvProgress(Math.floor((frameIndex / totalFrames) * 100));

            time += interval;
            resolve(captureNextFrame());
          }, "image/png");
        };

        video.addEventListener("seeked", onSeeked);
      });
    };

    try {
      await captureNextFrame();
    } catch (e) {
      console.error("Frame render error:", e);
      setConvStatus("error");
    }
  };

  return {
    videoFile,
    videoUrl,
    convWidth,
    convHeight,
    convFps,
    convLoop,
    convStatus,
    convProgress,
    convCurrentFrame,
    convTotalFrames,
    setConvWidth,
    setConvHeight,
    setConvFps,
    setConvLoop,
    handleVideoSelect,
    processVideoToBootanim,
  };
}
