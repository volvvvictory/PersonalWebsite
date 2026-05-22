import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']);

const DIRS = [
  { src: './root/assets/Gallery', out: './root/assets/Gallery/webp' },
  { src: './root/assets/Shop',    out: './root/assets/Shop/webp' },
];

const SIZES = [400, 800];

async function convertDir({ src, out }) {
  await mkdir(out, { recursive: true });
  const files = await readdir(src);
  const images = files.filter(f => IMAGE_EXTS.has(extname(f)));
  if (!images.length) return;

  console.log(`\n${src} — ${images.length} images`);

  for (const file of images) {
    const inputPath = join(src, file);
    const nameNoExt = basename(file, extname(file));

    await sharp(inputPath).webp({ quality: 82 }).toFile(join(out, `${nameNoExt}.webp`));

    for (const size of SIZES) {
      await sharp(inputPath)
        .resize(size, null, { withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(join(out, `${nameNoExt}-${size}w.webp`));
    }

    process.stdout.write(`  ✓ ${file}\n`);
  }
}

(async () => {
  for (const dir of DIRS) await convertDir(dir);
  console.log('\nDone.');
})().catch(err => { console.error(err); process.exit(1); });
