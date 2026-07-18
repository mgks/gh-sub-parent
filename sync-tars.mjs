#!/usr/bin/env node
/**
 * sync-tars.mjs
 *
 * Copies versionless local tarballs from the docmd monorepo (_playground/local-tars/)
 * into this repo's local-tars/ directory so `npm install` can install from them.
 *
 * Usage (local dev):
 *   node sync-tars.mjs                  — auto-detects monorepo next to this repo
 *   node sync-tars.mjs --source /path   — explicit path to _playground/local-tars/
 *
 * Usage (CI — called automatically by deploy.yml after pnpm prep):
 *   node sync-tars.mjs --source /path/to/_playground/local-tars
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Resolve source directory ──────────────────────────────────────────────────

const args = process.argv.slice(2);
const sourceArgIdx = args.indexOf('--source');
let sourceDir;

if (sourceArgIdx !== -1 && args[sourceArgIdx + 1]) {
  sourceDir = path.resolve(args[sourceArgIdx + 1]);
} else {
  // Auto-detect: look for _playground/local-tars/ relative to this repo.
  // Assumes both repos sit side-by-side under the same parent directory.
  const candidates = [
    path.resolve(__dirname, '../docmd/_playground/local-tars'),
    path.resolve(__dirname, '../../docmd/_playground/local-tars'),
  ];
  sourceDir = candidates.find(p => fs.existsSync(p));
}

if (!sourceDir || !fs.existsSync(sourceDir)) {
  console.error('sync-tars: source directory not found.');
  console.error('  Run `pnpm prep` in the docmd monorepo first to generate tarballs, then re-run this script.');
  console.error('  Or specify manually: node sync-tars.mjs --source /path/to/_playground/local-tars');
  process.exit(1);
}

// ── Sync ───────────────────────────────────────────────────────────────────────

const destDir = path.join(__dirname, 'local-tars');
fs.mkdirSync(destDir, { recursive: true });

const tars = fs.readdirSync(sourceDir).filter(f => f.endsWith('.tgz'));

if (tars.length === 0) {
  console.error(`sync-tars: no .tgz files found in ${sourceDir}`);
  console.error('  Run `pnpm prep` in the docmd monorepo first.');
  process.exit(1);
}

let copied = 0;
for (const file of tars) {
  const src = path.join(sourceDir, file);
  const dest = path.join(destDir, file);
  fs.copyFileSync(src, dest);
  copied++;
}

console.log(`sync-tars: copied ${copied} tarballs from ${sourceDir} → ${destDir}`);
