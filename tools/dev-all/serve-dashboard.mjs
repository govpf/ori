#!/usr/bin/env node
/**
 * Serveur HTTP du dashboard de dev.
 *
 * Sert `dashboard/index.html` et `dashboard/apps.json` sur le port 3000.
 * `apps.json` est généré par `dev.mjs` au démarrage et lu par le
 * dashboard côté client pour afficher la liste des apps et pinger
 * leur état.
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, 'dashboard');
const PORT = 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filepath = path.join(ROOT, url);
  if (!filepath.startsWith(ROOT) || !existsSync(filepath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }
  const ext = path.extname(filepath);
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  res.end(readFileSync(filepath));
});

server.listen(PORT, () => {
  console.log(`Dashboard prêt sur http://localhost:${PORT}`);
});
