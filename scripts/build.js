#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('[CampusBuddy Build] Starting production build...');

// Step 1: Ensure campusbuddy.html and index.html are synchronized
execSync(`node "${path.join(__dirname, 'sync-html.js')}"`, { stdio: 'inherit' });

// Step 2: Prepare dist/ directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Step 3: Copy only public distribution files into dist/
const PUBLIC_FILES = [
  'index.html',
  'campusbuddy.html',
  'manifest.webmanifest',
  'sw.js',
  'favicon.ico',
  'thumbnail.png',
  'gallery_overview.png',
  'DESIGN.md',
  '_headers',
  '_redirects'
];

for (const file of PUBLIC_FILES) {
  const src = path.join(rootDir, file);
  const dst = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
  }
}

// Step 3b: Copy assets/ directory if present
const assetsSrc = path.join(rootDir, 'assets');
const assetsDst = path.join(distDir, 'assets');
if (fs.existsSync(assetsSrc)) {
  fs.cpSync(assetsSrc, assetsDst, { recursive: true });
}

// Step 4: GitHub Pages & SPA routing helpers
// .nojekyll bypasses Jekyll processing; 404.html enables client-side routing fallback
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));

console.log(`[CampusBuddy Build] Copied ${PUBLIC_FILES.length} public assets and generated .nojekyll + 404.html SPA fallback in dist/.`);
console.log('[CampusBuddy Build] Production build completed successfully.');
