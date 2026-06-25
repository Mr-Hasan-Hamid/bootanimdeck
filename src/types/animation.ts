export interface Part {
  type: string;
  loopCount: number;
  pause: number;
  folder: string;
}

export interface AnimationItem {
  id: string;
  folderName: string;
  name: string;
  width: number;
  height: number;
  fps: number;
  parts: Part[];
  sizeBytes: number;
  sizeFormatted: string;
  zipName: string;
  zipUrl: string;
  gifUrl: string | null;
  coverUrl: string | null;
}
