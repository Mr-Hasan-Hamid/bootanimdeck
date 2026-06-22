export const RESOLUTION_OPTIONS = [
  { value: "sd", label: "480 × 854  —  SD  (Recommended, ~2–4 MB)" },
  { value: "hd", label: "720 × 1280  —  HD  (Larger, ~8–15 MB)" },
];

export const RESOLUTION_MAP: Record<string, { w: number; h: number }> = {
  sd: { w: 480,  h: 854  },
  hd: { w: 720,  h: 1280 },
};

export const FPS_OPTIONS = [
  { value: 10, label: "10 FPS  —  Ultra-small" },
  { value: 12, label: "12 FPS  —  Optimal (Recommended)" },
  { value: 15, label: "15 FPS  —  Smooth" },
  { value: 24, label: "24 FPS  —  Cinematic (large)" },
];

export const LOOP_MODE_OPTIONS = [
  { value: "intro-loop", label: "Intro + Loop  (like OEM boot anims)" },
  { value: "single",     label: "Single Part" },
];

export const LOOP_COUNT_OPTIONS = [
  { value: 0, label: "Infinite Loop" },
  { value: 1, label: "Play Once" },
];

export const RESIZE_OPTIONS = [
  { value: "cover",   label: "Cover  (fill & crop excess)" },
  { value: "contain", label: "Contain  (fit with black bars)" },
];

/** Smoothing: blur radius applied before PNG export to reduce entropy → smaller PNGs */
export const SMOOTHING_OPTIONS = [
  { value: 0,   label: "None  (raw pixels)" },
  { value: 0.4, label: "Subtle  (Recommended)" },
  { value: 0.8, label: "Medium" },
  { value: 1.2, label: "Strong  (smallest files)" },
];
