#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const src = path.join(rootDir, 'campusbuddy.html');
const dst = path.join(rootDir, 'index.html');

if (!fs.existsSync(src)) {
  console.error('[CampusBuddy Sync] Error: campusbuddy.html does not exist.');
  process.exit(1);
}

// Safety check: Prevent accidental overwriting if index.html was directly edited and is significantly newer
const args = process.argv.slice(2);
const forceSync = args.includes('--force');
const fromIndex = args.includes('--from-index');

if (fs.existsSync(dst)) {
  const srcStat = fs.statSync(src);
  const dstStat = fs.statSync(dst);
  const srcRaw = fs.readFileSync(src, 'utf8');
  const dstRaw = fs.readFileSync(dst, 'utf8');

  if (srcRaw !== dstRaw && dstStat.mtimeMs > srcStat.mtimeMs + 3000 && !forceSync && !fromIndex) {
    console.warn('[CampusBuddy Sync] Warning: index.html has modifications and is newer than campusbuddy.html.');
    console.warn('  Run with --force to overwrite index.html, or --from-index to propagate index.html -> campusbuddy.html.');
  }

  if (fromIndex) {
    let contentFromIndex = dstRaw.replace(/\r\n/g, '\n');
    fs.writeFileSync(src, contentFromIndex, 'utf8');
    fs.writeFileSync(dst, contentFromIndex, 'utf8');
    console.log(`[CampusBuddy Sync] Propagated index.html -> campusbuddy.html (${contentFromIndex.length} bytes).`);
    process.exit(0);
  }
}

// Normalize to LF across both files so Windows git checkouts maintain exact byte-for-byte parity
let content = fs.readFileSync(src, 'utf8');
content = content.replace(/\r\n/g, '\n');

fs.writeFileSync(src, content, 'utf8');
fs.writeFileSync(dst, content, 'utf8');

console.log(`[CampusBuddy Sync] Successfully synchronized campusbuddy.html -> index.html (${content.length} bytes, LF normalized).`);
