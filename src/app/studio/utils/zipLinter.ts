"use client";

import type JSZip from "jszip";

interface PartConfig {
  type: string;
  loopCount: number;
  pause: number;
  folder: string;
}

export function runZipLint(
  descFile: JSZip.JSZipObject | null,
  parsedWidth: number,
  parsedHeight: number,
  parsedFps: number,
  allFiles: string[],
  uniqueFolders: string[],
  parsedParts: PartConfig[]
) {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!descFile) {
    warnings.push(
      "Missing desc.txt file inside root of ZIP. A default desc.txt configuration has been created automatically."
    );
  } else {
    if (parsedWidth <= 0 || parsedHeight <= 0 || parsedFps <= 0) {
      errors.push(
        `Invalid first line in desc.txt: width=${parsedWidth}, height=${parsedHeight}, fps=${parsedFps}`
      );
    }
    if (parsedWidth % 2 !== 0 || parsedHeight % 2 !== 0) {
      warnings.push(
        `Non-even dimensions: ${parsedWidth}x${parsedHeight}. Android bootloader requires even dimensions to render correctly on hardware.`
      );
    }
    if (parsedWidth > 2160 || parsedHeight > 4000) {
      warnings.push(
        `Extremely high resolution: ${parsedWidth}x${parsedHeight}. Boot animations this large are prone to high latency and bootlag.`
      );
    }
  }

  let upperCaseWarned = false;
  let spacesWarned = false;
  let wrongExtWarned = false;

  allFiles.forEach((file) => {
    if (file.endsWith("/")) return;
    const partsList = file.split("/");
    const baseName = partsList.pop() || "";
    const isNested = partsList.length > 0;

    if (isNested) {
      if (/[A-Z]/.test(baseName) && !upperCaseWarned) {
        warnings.push(
          "Uppercase letters detected in image filenames. Standard Android ROMs may fail to load folders containing uppercase filenames."
        );
        upperCaseWarned = true;
      }
      if (/\s/.test(baseName) && !spacesWarned) {
        errors.push(
          "Spaces detected in image filenames. Spaces in file names inside part directories will cause bootloops on Android."
        );
        spacesWarned = true;
      }

      const dotIndex = baseName.lastIndexOf(".");
      const ext = dotIndex !== -1 ? baseName.substring(dotIndex).toLowerCase() : "";
      if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && !wrongExtWarned) {
        warnings.push(
          `Unsupported file type detected in animation folder: "${baseName}". Animation folders should contain only image files (.png/.jpg).`
        );
        wrongExtWarned = true;
      }
    } else {
      if (file !== "desc.txt" && !wrongExtWarned) {
        warnings.push(
          `Unsupported file type detected in zip root: "${file}". Only desc.txt and animation folders should be present in root.`
        );
        wrongExtWarned = true;
      }
    }
  });

  parsedParts.forEach((part) => {
    if (!uniqueFolders.includes(part.folder)) {
      errors.push(
        `desc.txt line references folder "${part.folder}", but this folder does not exist in the ZIP.`
      );
    }
  });

  return { errors, warnings };
}
