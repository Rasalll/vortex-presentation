import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, '../public/photos/Ordered images');
const outputFile = path.join(__dirname, '../src/slides.json');

function generateSlideManifest() {
  try {
    if (!fs.existsSync(targetDir)) {
      console.warn(`Directory not found: ${targetDir}`);
      fs.writeFileSync(outputFile, JSON.stringify([]));
      return;
    }

    const files = fs.readdirSync(targetDir);

    // Filter image files, extract numerical prefix, sort numerically: 1.png, 2.png, ..., 10.png
    const validSlides = files
      .filter((file) => /\.(png|jpe?g|webp|gif|svg)$/i.test(file))
      .map((file) => {
        const match = file.match(/^(\d+)\./);
        const num = match ? parseInt(match[1], 10) : Infinity;
        return { file, num };
      })
      .filter((item) => item.num !== Infinity)
      .sort((a, b) => a.num - b.num)
      .map((item) => `/photos/Ordered images/${item.file}`);

    const srcDir = path.dirname(outputFile);
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(validSlides, null, 2));
    console.log(`[Manifest Generator] Generated ${validSlides.length} slide entries in slides.json`);
  } catch (err) {
    console.error('[Manifest Generator] Error generating slide manifest:', err);
  }
}

generateSlideManifest();
