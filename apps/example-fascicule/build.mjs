// Build statique : produit dist/ (HTML, CSS, JS, polices, SVG). Lancé
// après copy-assets.mjs via le hook prebuild.

import { cpSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(here, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const entry of ['index.html', 'fascicule.css', 'fascicule.js', 'css', 'assets']) {
  cpSync(path.join(here, entry), path.join(dist, entry), { recursive: true });
}

console.log('[build] fascicule copié vers dist/');
