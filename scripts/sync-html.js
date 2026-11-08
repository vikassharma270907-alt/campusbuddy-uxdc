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

// Normalize to LF across both files so Windows git checkouts maintain exact byte-for-byte parity
let content = fs.readFileSync(src, 'utf8');
content = content.replace(/\r\n/g, '\n');

fs.writeFileSync(src, content, 'utf8');
fs.writeFileSync(dst, content, 'utf8');

console.log(`[CampusBuddy Sync] Successfully synchronized campusbuddy.html -> index.html (${content.length} bytes, LF normalized).`);
