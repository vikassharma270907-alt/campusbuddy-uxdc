const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

const rootDir = path.resolve(__dirname, '..');
const appHtml = path.join(rootDir, 'campusbuddy.html');
const outPng = path.join(rootDir, 'gallery_overview.png');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-gallery-'));

console.log('Rendering app screenshot...');
const fileUrl = 'file:///' + appHtml.replace(/\\/g, '/');

const res = spawnSync(edgePath, [
  '--headless=new',
  `--user-data-dir=${tempDir}`,
  `--screenshot=${outPng}`,
  '--window-size=1200,800',
  '--hide-scrollbars',
  fileUrl
], { encoding: 'utf-8' });

if (fs.existsSync(outPng)) {
  console.log(`Created gallery image: ${outPng} (${fs.statSync(outPng).size} bytes)`);
} else {
  console.error('Failed to create gallery image');
}

try {
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch (e) {}

