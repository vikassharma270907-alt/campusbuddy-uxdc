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
  'video_showcase.html',
  'video.html',
  'campusbuddy_showcase.mp4',
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

// Step 5: Static health and API endpoints for CDN / serverless deployments
const healthPayload = JSON.stringify({
  status: 'healthy',
  timestamp: new Date().toISOString(),
  environment: 'production',
  service: 'campusbuddy-cdn'
}, null, 2);
fs.writeFileSync(path.join(distDir, 'health'), healthPayload);
fs.writeFileSync(path.join(distDir, 'healthz'), healthPayload);
fs.writeFileSync(path.join(distDir, 'health.json'), healthPayload);
fs.writeFileSync(path.join(distDir, 'healthz.json'), healthPayload);

// Generate static /calendar.ics in dist/
const pad = n => String(n).padStart(2, '0');
const formatIcsDate = d =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
const now = new Date();
const dtStamp = formatIcsDate(now);
const staticIcs = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//CampusBuddy//UXDC 2026//EN',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  'X-WR-CALNAME:CampusBuddy Micro-Moments',
  'X-WR-TIMEZONE:UTC',
  'BEGIN:VEVENT',
  'UID:tfdl-sprint-1@campusbuddy.local',
  `DTSTAMP:${dtStamp}`,
  `DTSTART:${formatIcsDate(new Date(now.getTime() + 2 * 3600000))}`,
  `DTEND:${formatIcsDate(new Date(now.getTime() + 3.5 * 3600000))}`,
  'SUMMARY:CampusBuddy: TFDL Silent Study Sprint · 90-Min Deep Work',
  'DESCRIPTION:Focused peer study session at TFDL 2nd Floor Commons. Low-pressure micro-connection.',
  'LOCATION:TFDL 2nd Floor Commons',
  'STATUS:CONFIRMED',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');
fs.writeFileSync(path.join(distDir, 'calendar.ics'), staticIcs);

// Generate static /api/spots in dist/
const apiDir = path.join(distDir, 'api');
fs.mkdirSync(apiDir, { recursive: true });
const spotsPayload = JSON.stringify({
  status: 'ok',
  timestamp: new Date().toISOString(),
  campus: 'University of Calgary',
  spots: [
    { id: 'tfdl', name: 'TFDL 2nd Floor Commons', type: 'Quiet', busyness: 34, capacity: 'High', noise: 'Low', peerCount: 18 },
    { id: 'macewan', name: 'MacEwan Student Centre', type: 'Social', busyness: 78, capacity: 'High', noise: 'Lively', peerCount: 42 },
    { id: 'science', name: 'Science Theatres Concourse', type: 'Moderate', busyness: 52, capacity: 'Medium', noise: 'Moderate', peerCount: 24 },
    { id: 'kinesiology', name: 'Kinesiology Complex Atrium', type: 'Active', busyness: 45, capacity: 'Medium', noise: 'Moderate', peerCount: 15 },
    { id: 'engineering', name: 'Engineering Lounge (ENA)', type: 'Collaborative', busyness: 60, capacity: 'Medium', noise: 'Collaborative', peerCount: 30 },
    { id: 'taylor', name: 'Taylor Quad Outdoor Benches', type: 'Outdoor', busyness: 20, capacity: 'Open', noise: 'Quiet Ambient', peerCount: 12 }
  ]
}, null, 2);
fs.writeFileSync(path.join(apiDir, 'spots'), spotsPayload);
fs.writeFileSync(path.join(apiDir, 'spots.json'), spotsPayload);

console.log(`[CampusBuddy Build] Copied ${PUBLIC_FILES.length} public assets and generated .nojekyll, health endpoints + 404.html SPA fallback in dist/.`);
console.log('[CampusBuddy Build] Production build completed successfully.');
