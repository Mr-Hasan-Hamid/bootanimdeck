import JSZip from "jszip";

/**
 * Modifies the resolution inside the desc.txt file of a bootanimation.zip
 * @param originalZipBuffer The original ZIP file as an ArrayBuffer
 * @param targetWidth The new width to scale the animation container to
 * @param targetHeight The new height to scale the animation container to
 * @returns A Promise resolving to the modified ZIP file as an ArrayBuffer
 */
export async function resizeBootAnimation(
  originalZipBuffer: ArrayBuffer,
  targetWidth: number,
  targetHeight: number
): Promise<ArrayBuffer> {
  const zip = await JSZip.loadAsync(originalZipBuffer);
  const descFile = zip.file("desc.txt");
  if (!descFile) {
    throw new Error("desc.txt not found in boot animation ZIP");
  }

  const descContent = await descFile.async("string");
  // Split lines by LF or CRLF
  const lines = descContent.split(/\r?\n/);
  if (lines.length === 0) {
    throw new Error("desc.txt is empty");
  }

  // Parse the first line (width height fps)
  const firstLine = lines[0].trim();
  const tokens = firstLine.split(/\s+/);
  if (tokens.length < 3) {
    throw new Error("Invalid desc.txt format: first line must contain width, height, and fps");
  }

  const originalWidth = parseInt(tokens[0], 10);
  const originalHeight = parseInt(tokens[1], 10);

  // If resolution matches target, return original buffer
  if (originalWidth === targetWidth && originalHeight === targetHeight) {
    return originalZipBuffer;
  }

  // Update width and height tokens
  tokens[0] = targetWidth.toString();
  tokens[1] = targetHeight.toString();
  lines[0] = tokens.join(" ");

  // Join back using UNIX line endings (\n) as required by Android systems
  const newDescContent = lines.join("\n");

  // Overwrite desc.txt inside the JSZip container
  zip.file("desc.txt", newDescContent);

  // Generate the updated ZIP file
  return await zip.generateAsync({ type: "arraybuffer" });
}
