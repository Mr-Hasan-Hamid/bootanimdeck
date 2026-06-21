import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');

    if (!folder) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const EXTRACTED_DIR = path.resolve(process.cwd(), '../extracted');
    const targetDir = path.join(EXTRACTED_DIR, folder);

    if (!fs.existsSync(targetDir)) {
      return NextResponse.json({ error: 'Animation directory not found' }, { status: 404 });
    }

    // Read subdirectories to find parts (e.g., part0, part1)
    const items = fs.readdirSync(targetDir);
    const partDirs = items.filter(item => {
      return fs.statSync(path.join(targetDir, item)).isDirectory() && item.startsWith('part');
    }).sort();

    if (partDirs.length === 0) {
      return NextResponse.json({ error: 'No animation parts found' }, { status: 404 });
    }

    // For simplicity, load frames from the first part (usually part0) or all parts
    // Let's return frame paths grouped by part directory
    const partsData = [];

    for (const partDir of partDirs) {
      const partPath = path.join(targetDir, partDir);
      const fileNames = fs.readdirSync(partPath)
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
        })
        .sort((a, b) => {
          // Attempt natural sorting (e.g., frame_2.png before frame_10.png)
          return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
        });

      const frameUrls = fileNames.map(fileName => {
        return `/extracted/${encodeURIComponent(folder)}/${partDir}/${fileName}`;
      });

      partsData.push({
        partName: partDir,
        frames: frameUrls
      });
    }

    return NextResponse.json({ parts: partsData });
  } catch (error) {
    const err = error as Error;
    console.error('Error listing animation frames:', err);
    return NextResponse.json({ error: 'Failed to retrieve frames', details: err.message }, { status: 500 });
  }
}
