#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SUSPICIOUS_PATTERNS = [
  /-----BEGIN [A-Z]+ PRIVATE KEY-----/,
  /AKIA[0-9A-Z]{16}/,
  /ghp_[0-9a-zA-Z]{36}/,
  /github_pat_[0-9a-zA-Z_]{82}/,
  /xox[baprs]-[0-9a-zA-Z]{10,48}/,
  /AIza[0-9A-Za-z\-_]{35}/,
  /(?:password|passwd|secret|api[_-]?key)\s*[:=]\s*["'][a-zA-Z0-9_\-]{16,}["']/i
];

const IGNORED_DIRS = new Set(['.git', 'node_modules', 'dist', 'assets']);
const IGNORED_FILES = new Set(['package-lock.json', '.mcp.json']);

let foundSecrets = 0;

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        scanDir(path.join(dir, entry.name));
      }
    } else if (entry.isFile()) {
      if (IGNORED_FILES.has(entry.name)) continue;
      const filePath = path.join(dir, entry.name);
      const ext = path.extname(filePath);
      if (['.html', '.js', '.mjs', '.cjs', '.json', '.yml', '.yaml', '.md', '.txt', '.env'].includes(ext) || entry.name.startsWith('.env')) {
        const content = fs.readFileSync(filePath, 'utf8');
        for (const pattern of SUSPICIOUS_PATTERNS) {
          if (pattern.test(content)) {
            console.error(`[SECRET SCAN FAILED] Potential secret pattern matched in: ${path.relative(rootDir, filePath)}`);
            foundSecrets++;
          }
        }
      }
    }
  }
}

scanDir(rootDir);

if (foundSecrets > 0) {
  console.error(`[SECRET SCAN] Found ${foundSecrets} potential secret(s)!`);
  process.exit(1);
} else {
  console.log('[SECRET SCAN] ✓ Clean. Zero leaked secrets or credentials detected.');
  process.exit(0);
}
