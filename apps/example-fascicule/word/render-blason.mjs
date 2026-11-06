/**
 * Rend le blason (images/blason.png) à partir du logo SVG du site, sans
 * l'ombre portée du SVG et sur fond blanc opaque : une ombre ou des pixels
 * de bord semi-transparents apparaissent dans Word comme un anneau gris.
 * Utilise Microsoft Edge en mode headless via le protocole DevTools.
 *
 *   node apps/example-fascicule/word/render-blason.mjs
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const svgPath = process.argv[2] ?? join(here, '../../ori-site/public/assets/logo-pf.svg');
const out = process.argv[3] ?? join(here, 'images/blason.png');
const edge =
  process.env.EDGE_PATH ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const port = 9334;
const px = 600;

// Retire le filtre d'ombre et recadre sur le disque (300 × 300).
const svg = readFileSync(svgPath, 'utf8')
  .replace(/<g filter="url\(#[^"]+\)">/, '<g>')
  .replace(
    /width="308" height="308" viewBox="0 0 308 308"/,
    `width="${px}" height="${px}" viewBox="0 0 300 300"`,
  );
const html = `<html><body style="margin:0;background:#fff">${svg}</body></html>`;

const proc = spawn(edge, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--no-first-run',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'blason-edge-'))}`,
  'about:blank',
]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50 && !targets; i++) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  } catch {
    await sleep(200);
  }
}
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (pending.has(m.id)) {
    pending.get(m.id)(m);
    pending.delete(m.id);
  }
});
const send = (method, params = {}) =>
  new Promise((res) => {
    const i = ++id;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });

await send('Page.enable');
await send('Page.navigate', {
  url: 'data:text/html;base64,' + Buffer.from(html).toString('base64'),
});
await sleep(1000);
const shot = await send('Page.captureScreenshot', {
  format: 'png',
  clip: { x: 0, y: 0, width: px, height: px, scale: 1 },
});
writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
console.log(`blason.png : ${px} × ${px} px`);
ws.close();
proc.kill();
process.exit(0);
