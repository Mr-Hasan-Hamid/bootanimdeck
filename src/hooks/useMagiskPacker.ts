"use client";

import { useState } from "react";
import JSZip from "jszip";
import { resizeBootAnimation } from "@/utils/resizeZip";

export type ModuleType = "magisk" | "kernelsu";

export function useMagiskPacker() {
  const [packingType, setPackingType] = useState<ModuleType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const packAndDownloadModule = async (
    type: ModuleType,
    zipUrl: string,
    animationName: string,
    targetWidth?: number,
    targetHeight?: number
  ) => {
    setPackingType(type);
    setError(null);
    try {
      // 1. Fetch the raw bootanimation zip via proxy to bypass CORS
      const proxyUrl = `/api/download?url=${encodeURIComponent(zipUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch boot animation zip. Status: ${response.status}`);
      }
      let zipBuffer = await response.arrayBuffer();

      // If target resolution is specified, resize it on the fly!
      if (targetWidth && targetHeight) {
        zipBuffer = await resizeBootAnimation(zipBuffer, targetWidth, targetHeight);
      }

      // 2. Create the Module ZIP using JSZip
      const moduleZip = new JSZip();
      const normalizedName = animationName.replace(/[^a-zA-Z0-9_\- ]/g, "");
      const cleanSlug = normalizedName.toLowerCase().replace(/ /g, "_");

      const isKsu = type === "kernelsu";
      const moduleId = isKsu ? `bootanimdeck_ksu_${cleanSlug}` : `bootanimdeck_${cleanSlug}`;
      const moduleName = isKsu ? `BootAnimDeck (KernelSU) - ${normalizedName}` : `BootAnimDeck - ${normalizedName}`;
      const moduleDesc = isKsu
        ? `Systemless KernelSU boot animation overlay for ${normalizedName}. Mounts into system, product, and system_ext partitions systemlessly.`
        : `Systemless custom boot animation for ${normalizedName}. Replaces standard, product, and system_ext paths systemlessly.`;

      const moduleProp = [
        `id=${moduleId}`,
        `name=${moduleName}`,
        `version=1.0`,
        `versionCode=1`,
        `author=BootAnimDeck`,
        `description=${moduleDesc}`,
      ].join("\n");

      const updateBinary = [
        `#!/system/bin/sh`,
        `MODPATH="$1"`,
        `ZIPFILE="$3"`,
        `unzip -o "$ZIPFILE" -d "$MODPATH"`,
        `chmod -R 755 "$MODPATH"`,
        `find "$MODPATH" -type f -exec chmod 644 {} +`,
        `exit 0`,
      ].join("\n");

      // Write files to zip
      moduleZip.file("module.prop", moduleProp);
      moduleZip.file("META-INF/com/google/android/update-binary", updateBinary, {
        unixPermissions: "755",
      });
      moduleZip.file("META-INF/com/google/android/updater-script", "# Dummy updater-script\n");

      // Store the custom bootanimation.zip binary in all common paths to guarantee compatibility
      moduleZip.file("system/media/bootanimation.zip", zipBuffer);
      moduleZip.file("system/product/media/bootanimation.zip", zipBuffer);
      moduleZip.file("system/system_ext/media/bootanimation.zip", zipBuffer);
      moduleZip.file("product/media/bootanimation.zip", zipBuffer);

      // 3. Generate the ZIP blob
      const content = await moduleZip.generateAsync({ type: "blob" });

      // 4. Download it
      const downloadName = isKsu ? `kernelsu_module_${cleanSlug}.zip` : `magisk_module_${cleanSlug}.zip`;
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`${type} module generation error:`, err);
      setError(err instanceof Error ? err.message : `Failed to package ${type} module.`);
    } finally {
      setPackingType(null);
    }
  };

  const downloadAsMagiskModule = (
    zipUrl: string,
    animationName: string,
    targetWidth?: number,
    targetHeight?: number
  ) => packAndDownloadModule("magisk", zipUrl, animationName, targetWidth, targetHeight);

  const downloadAsKernelSUModule = (
    zipUrl: string,
    animationName: string,
    targetWidth?: number,
    targetHeight?: number
  ) => packAndDownloadModule("kernelsu", zipUrl, animationName, targetWidth, targetHeight);

  return {
    downloadAsMagiskModule,
    downloadAsKernelSUModule,
    packAndDownloadModule,
    packingType,
    packing: packingType !== null,
    error,
  };
}

export default useMagiskPacker;
