import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const size = 1024;
const pad = 160;
const r = (size - pad * 2) / 2;
const cx = size / 2;
const cy = size / 2;

// Build sine wave path
let wave = '';
for (let i = 0; i <= 100; i++) {
  const t = i / 100;
  const x = (cx - r * 0.58) + t * r * 1.16;
  const y = cy - (r * 0.48) * Math.sin(t * Math.PI * 2);
  wave += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0f1117"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#7c8cf8" stroke-width="42"/>
  <path d="${wave}" fill="none" stroke="#7c8cf8" stroke-width="46" stroke-linecap="round"/>
</svg>`;

const outPath = join(__dirname, '..', 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset', 'AppIcon-512@2x.png');

await sharp(Buffer.from(svg)).resize(1024, 1024).flatten({ background: '#0f1117' }).png().toFile(outPath);
console.log('Generated:', outPath);

// Also generate for Android
const androidPath = join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const sizes = [
  ['mipmap-mdpi', 48],
  ['mipmap-hdpi', 72],
  ['mipmap-xhdpi', 96],
  ['mipmap-xxhdpi', 144],
  ['mipmap-xxxhdpi', 192],
];

for (const [folder, s] of sizes) {
  const dir = join(androidPath, folder);
  await sharp(Buffer.from(svg)).resize(s, s).png().toFile(join(dir, 'ic_launcher.png'));
  // Round icon (same for now)
  await sharp(Buffer.from(svg)).resize(s, s).png().toFile(join(dir, 'ic_launcher_round.png'));
  console.log(`Generated: ${folder}/ic_launcher.png (${s}x${s})`);
}

// Foreground for adaptive icon
const fgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="none" stroke="#7c8cf8" stroke-width="32"/>
  <path d="${wave}" fill="none" stroke="#7c8cf8" stroke-width="36" stroke-linecap="round" transform="scale(0.72) translate(${cx * 0.39} ${cy * 0.39})"/>
</svg>`;

for (const [folder, s] of sizes) {
  const dir = join(androidPath, folder);
  await sharp(Buffer.from(fgSvg)).resize(s, s).png().toFile(join(dir, 'ic_launcher_foreground.png'));
}

console.log('Done!');
