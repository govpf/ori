// Build statique : produit dist/ avec les 7 mires HTML + CSS + assets.
// Lancé après copy-css.mjs (qui copie ds.css + crest officiel) via le
// hook prebuild.

import { copyFileSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

const exts = new Set(['.html', '.css', '.svg', '.png', '.jpg', '.webp', '.ttf']);
let count = 0;
for (const file of readdirSync(__dirname)) {
  if (file === 'dist' || file === 'node_modules') continue;
  const src = path.join(__dirname, file);
  if (!statSync(src).isFile()) continue;
  if (!exts.has(path.extname(file).toLowerCase())) continue;
  copyFileSync(src, path.join(distDir, file));
  count++;
}

console.log(`[build] ${count} fichier(s) copié(s) vers dist/`);
