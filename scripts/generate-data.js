const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const EXTRACTED_DIR = path.resolve(BASE_DIR, '../extracted');
const ZIPS_DIR = path.resolve(BASE_DIR, '../source-zips');
const PREVIEWS_DIR = path.resolve(BASE_DIR, '../previews');
const OUTPUT_FILE = path.join(BASE_DIR, 'src/data/animations.json');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function parseDesc(descPath) {
  try {
    if (!fs.existsSync(descPath)) return null;
    const content = fs.readFileSync(descPath, 'utf-8');
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) return null;

    const firstLine = lines[0].split(/\s+/);
    const width = parseInt(firstLine[0], 10) || 0;
    const height = parseInt(firstLine[1], 10) || 0;
    const fps = parseInt(firstLine[2], 10) || 0;

    const parts = [];
    for (let i = 1; i < lines.length; i++) {
      const partsTokens = lines[i].split(/\s+/);
      if (partsTokens.length >= 4) {
        parts.push({
          type: partsTokens[0], // 'p' or 'c'
          loopCount: parseInt(partsTokens[1], 10),
          pause: parseInt(partsTokens[2], 10),
          folder: partsTokens[3]
        });
      }
    }

    return { width, height, fps, parts };
  } catch (e) {
    console.error(`Error parsing desc.txt at ${descPath}:`, e);
    return null;
  }
}

function generate() {
  console.log('Generating animation database...');
  if (!fs.existsSync(EXTRACTED_DIR)) {
    console.error(`Extracted directory not found: ${EXTRACTED_DIR}`);
    process.exit(1);
  }

  const animDirs = fs.readdirSync(EXTRACTED_DIR).filter(name => {
    return fs.statSync(path.join(EXTRACTED_DIR, name)).isDirectory();
  });

  console.log(`Found ${animDirs.length} animations in extracted/`);

  const data = [];

  for (const dirName of animDirs) {
    // Expected name format: "Name bootanimation"
    // We clean up " bootanimation" for display name
    let displayName = dirName;
    if (displayName.toLowerCase().endsWith(' bootanimation')) {
      displayName = displayName.substring(0, displayName.length - ' bootanimation'.length);
    }

    const descPath = path.join(EXTRACTED_DIR, dirName, 'desc.txt');
    const descData = parseDesc(descPath);

    // ZIP file info
    const zipName = `${dirName}.zip`;
    const zipPath = path.join(ZIPS_DIR, zipName);
    let sizeBytes = 0;
    let sizeFormatted = '0 Bytes';

    if (fs.existsSync(zipPath)) {
      const stat = fs.statSync(zipPath);
      sizeBytes = stat.size;
      sizeFormatted = formatBytes(sizeBytes);
    } else {
      console.warn(`Zip file not found: ${zipPath}`);
    }

    // GIF preview info
    const gifName = `${dirName}.gif`;
    const gifPath = path.join(PREVIEWS_DIR, gifName);
    const hasPreview = fs.existsSync(gifPath);

    // Find cover image (first static frame)
    let coverUrl = null;
    if (descData && descData.parts && descData.parts.length > 0) {
      const firstPartDir = descData.parts[0].folder;
      const partPath = path.join(EXTRACTED_DIR, dirName, firstPartDir);
      if (fs.existsSync(partPath)) {
        const files = fs.readdirSync(partPath).filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
        }).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

        if (files.length > 0) {
          coverUrl = `/extracted/${encodeURIComponent(dirName)}/${encodeURIComponent(firstPartDir)}/${encodeURIComponent(files[0])}`;
        }
      }
    }

    data.push({
      id: dirName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      folderName: dirName,
      name: displayName,
      width: descData ? descData.width : 0,
      height: descData ? descData.height : 0,
      fps: descData ? descData.fps : 0,
      parts: descData ? descData.parts : [],
      sizeBytes,
      sizeFormatted,
      zipName,
      zipUrl: `/source-zips/${encodeURIComponent(zipName)}`,
      gifUrl: hasPreview ? `/previews/${encodeURIComponent(gifName)}` : null,
      coverUrl
    });
  }

  // Ensure output directory exists
  const outputFile = OUTPUT_FILE;
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Successfully generated database with ${data.length} animations at ${outputFile}`);
}

generate();
