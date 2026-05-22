import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const GALLERY_DIR = './root/assets/Gallery';
const WEBP_DIR = './root/assets/Gallery/webp';
const SIZES = [400, 800];
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']);

async function convertImages() {
  await mkdir(WEBP_DIR, { recursive: true });

  const files = await readdir(GALLERY_DIR);
  const images = files.filter(f => IMAGE_EXTS.has(extname(f)));

  console.log(`Converting ${images.length} images to WebP...`);

  for (const file of images) {
    const inputPath = join(GALLERY_DIR, file);
    const nameNoExt = basename(file, extname(file));

    await sharp(inputPath)
      .webp({ quality: 82 })
      .toFile(join(WEBP_DIR, `${nameNoExt}.webp`));

    for (const size of SIZES) {
      await sharp(inputPath)
        .resize(size, null, { withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(join(WEBP_DIR, `${nameNoExt}-${size}w.webp`));
    }

    process.stdout.write(`  ✓ ${file}\n`);
  }

  console.log(`\nDone — ${images.length} images converted.`);
}

convertImages().catch(err => { console.error(err); process.exit(1); });
