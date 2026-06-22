/** Human-readable byte size */
export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Fast non-cryptographic hash of an ImageData for frame deduplication.
 * Samples every 48th pixel (RGBA stride) — fast enough for real-time use.
 */
export function fastHash(data: Uint8ClampedArray): number {
  let h = 0x811c9dc5;
  const step = 48 * 4;
  for (let i = 0; i < data.length; i += step) {
    h ^= data[i] ^ (data[i + 1] << 8) ^ (data[i + 2] << 16);
    h = (Math.imul(h, 0x01000193) >>> 0);
  }
  return h;
}

/**
 * Apply a CSS blur filter to a canvas context before PNG export.
 * A small blur (0.3–0.8px) smooths high-frequency noise, dramatically
 * reducing PNG entropy and thus file size — with no visible quality loss
 * on a boot animation sequence.
 */
export function applySmoothing(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  blurRadius: number
): void {
  if (blurRadius <= 0) return;
  // Draw the canvas onto itself with a blur filter
  const imageData = ctx.getImageData(0, 0, w, h);
  ctx.filter = `blur(${blurRadius}px)`;
  ctx.putImageData(imageData, 0, 0);
  // Re-draw to apply the filter (putImageData ignores filters; must drawImage)
  const tmp = document.createElement("canvas");
  tmp.width = w;
  tmp.height = h;
  const tmpCtx = tmp.getContext("2d")!;
  tmpCtx.putImageData(imageData, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(tmp, 0, 0);
  ctx.filter = "none";
}

/**
 * Estimated uncompressed ZIP size.
 * Heuristic: ~0.28 bytes/pixel for SD-res boot-style PNGs with smoothing,
 * ~0.32 bytes/pixel for HD without smoothing.
 */
export function estimateSize(
  w: number,
  h: number,
  frames: number,
  blurRadius: number
): number {
  const bytesPerPixel = blurRadius > 0 ? 0.22 : 0.32;
  return frames * w * h * bytesPerPixel;
}
