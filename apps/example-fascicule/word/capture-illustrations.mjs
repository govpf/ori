/**
 * Capture en PNG les illustrations de l'exemple HTML (couverture, écran
 * de connexion, bureau annoté) pour les réutiliser dans les fichiers Word.
 * Utilise Microsoft Edge en mode headless via le protocole DevTools.
 *
 *   pnpm --filter @govpf/ori-example-fascicule copy-assets
 *   node apps/example-fascicule/word/capture-illustrations.mjs
 *
 * Le blason (images/blason.png) est rendu par render-blason.mjs.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const htmlPath = process.argv[2] ?? join(here, '../index.html');
const outDir = process.argv[3] ?? join(here, 'images');
const edge =
  process.env.EDGE_PATH ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const port = 9333;

const proc = spawn(edge, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--no-first-run',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'fascicule-edge-'))}`,
  '--window-size=1200,1600',
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
  if (m.id && pending.has(m.id)) {
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
const evalJs = async (expression) =>
  (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result
    .result.value;

await send('Page.enable');
await send('Page.navigate', { url: pathToFileURL(htmlPath).href + '?format=a5' });
await sleep(1500);
await evalJs('document.fonts.ready.then(() => 1)');

/** Isole un élément seul dans la page, à sa largeur A5, pour la capture. */
function isolate(sel, idx, ratio) {
  if (!window.__orig) window.__orig = document.body.innerHTML;
  else document.body.innerHTML = window.__orig;
  const el = document.querySelectorAll(sel)[idx];
  const w = el.getBoundingClientRect().width;
  const clone = el.cloneNode(true);
  const main = document.querySelector('main.fascicule');
  const holder = document.createElement('main');
  for (const a of main.attributes) holder.setAttribute(a.name, a.value);
  holder.style.cssText = `position:absolute;left:0;top:0;margin:0;padding:0;background:transparent;width:${w}px`;
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  if (ratio) {
    clone.style.height = `${w * ratio}px`;
    clone.style.flex = 'none';
    clone.querySelector('svg').style.width = '58%';
  }
  holder.appendChild(clone);
  document.body.innerHTML = '';
  document.body.style.margin = '0';
  document.body.style.background = '#fff';
  document.body.appendChild(holder);
  const b = clone.getBoundingClientRect();
  return { x: b.x, y: b.y, w: b.width, h: b.height };
}

const jobs = [
  ['couverture', '.sheet--cover .cover__visual', 0, 0.62],
  ['connexion', '.figure__frame', 0, 0],
  ['bureau', '.figure__frame', 1, 0],
];
for (const [name, sel, idx, ratio] of jobs) {
  const rect = await evalJs(`(${isolate.toString()})(${JSON.stringify(sel)}, ${idx}, ${ratio})`);
  await sleep(200);
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: rect.x, y: rect.y, width: rect.w, height: rect.h, scale: 4 },
  });
  writeFileSync(join(outDir, `${name}.png`), Buffer.from(shot.result.data, 'base64'));
  console.log(`${name}.png : ${Math.round(rect.w)} × ${Math.round(rect.h)} px (× 4)`);
}
ws.close();
proc.kill();
process.exit(0);
