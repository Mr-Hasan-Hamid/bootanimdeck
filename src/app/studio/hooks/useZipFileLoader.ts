"use client";

import { useState } from "react";
import type JSZip from "jszip";
import animationsData from "../../../data/animations.json";
import { runZipLint } from "../utils/zipLinter";

interface PartConfig {
  type: string;
  loopCount: number;
  pause: number;
  folder: string;
}

export function useZipFileLoader(cleanupZipPreview: () => void) {
  const [loading, setLoading] = useState(false);
  const [loadedZip, setLoadedZip] = useState<JSZip | null>(null);
  const [zipName, setZipName] = useState("");
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1920);
  const [fps, setFps] = useState(30);
  const [parts, setParts] = useState<PartConfig[]>([]);
  const [fileCount, setFileCount] = useState(0);
  const [folders, setFolders] = useState<string[]>([]);
  const [lintErrors, setLintErrors] = useState<string[]>([]);
  const [lintWarnings, setLintWarnings] = useState<string[]>([]);

  const [isMagiskModule, setIsMagiskModule] = useState(false);
  const [nestedZipPath, setNestedZipPath] = useState("");
  const [parentZip, setParentZip] = useState<JSZip | null>(null);

  const loadZipData = async (fileBlob: Blob | File, fileName: string) => {
    setLoading(true);
    setZipName(fileName);
    setLintErrors([]);
    setLintWarnings([]);
    cleanupZipPreview();

    try {
      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(fileBlob);

      let nestedZipFile =
        zip.file("system/media/bootanimation.zip") ||
        zip.file("system/media/bootanimation/bootanimation.zip");

      if (!nestedZipFile) {
        const foundPath = Object.keys(zip.files).find((p) => p.endsWith("bootanimation.zip"));
        if (foundPath) {
          nestedZipFile = zip.file(foundPath);
        }
      }

      let activeZip = zip;

      if (nestedZipFile) {
        const nestedData = await nestedZipFile.async("blob");
        activeZip = await JSZip.loadAsync(nestedData);
        setParentZip(zip);
        setIsMagiskModule(true);
        setNestedZipPath(nestedZipFile.name);
      } else {
        setIsMagiskModule(false);
        setNestedZipPath("");
        setParentZip(null);
      }

      setLoadedZip(activeZip);

      const allFiles = Object.keys(activeZip.files);
      setFileCount(allFiles.length);

      const uniqueFolders = Array.from(
        new Set(
          allFiles
            .filter((p) => p.includes("/") && !p.endsWith("/"))
            .map((p) => p.split("/")[0])
        )
      ).sort();
      setFolders(uniqueFolders);

      let parsedParts: PartConfig[] = [];
      let parsedWidth = 1080;
      let parsedHeight = 1920;
      let parsedFps = 30;

      const descFile = activeZip.file("desc.txt");
      if (!descFile) {
        setWidth(1080);
        setHeight(1920);
        setFps(30);
        const fallbackParts = uniqueFolders.map((f) => ({
          type: "p",
          loopCount: 0,
          pause: 0,
          folder: f,
        }));
        setParts(fallbackParts);
        parsedParts = fallbackParts;
      } else {
        const descContent = await descFile.async("string");
        const lines = descContent
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        if (lines.length > 0) {
          const firstLine = lines[0].split(/\s+/);
          parsedWidth = parseInt(firstLine[0], 10) || 1080;
          parsedHeight = parseInt(firstLine[1], 10) || 1920;
          parsedFps = parseInt(firstLine[2], 10) || 30;

          setWidth(parsedWidth);
          setHeight(parsedHeight);
          setFps(parsedFps);

          for (let i = 1; i < lines.length; i++) {
            const tokens = lines[i].split(/\s+/);
            if (tokens.length >= 4) {
              parsedParts.push({
                type: tokens[0],
                loopCount: parseInt(tokens[1], 10) || 0,
                pause: parseInt(tokens[2], 10) || 0,
                folder: tokens[3],
              });
            }
          }
          setParts(parsedParts);
        }
      }

      const { errors, warnings } = runZipLint(
        descFile,
        parsedWidth,
        parsedHeight,
        parsedFps,
        allFiles,
        uniqueFolders,
        parsedParts
      );

      setLintErrors(errors);
      setLintWarnings(warnings);
    } catch (e) {
      console.error(e);
      alert("Error loading boot animation ZIP file. Ensure it is a valid ZIP archive.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadZipData(file, file.name);
  };

  const handleLoadFromLibrary = async (folderName: string) => {
    setLoading(true);
    try {
      const anim = animationsData.find((a) => a.folderName === folderName);
      if (!anim) return;

      const response = await fetch(anim.zipUrl);
      const blob = await response.blob();
      loadZipData(blob, anim.zipName);
    } catch (e) {
      console.error(e);
      alert("Failed to retrieve zip file from library.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    loadedZip,
    setLoadedZip,
    zipName,
    width,
    setWidth,
    height,
    setHeight,
    fps,
    setFps,
    parts,
    setParts,
    fileCount,
    folders,
    lintErrors,
    lintWarnings,
    isMagiskModule,
    nestedZipPath,
    parentZip,
    handleFileUpload,
    handleLoadFromLibrary,
  };
}
