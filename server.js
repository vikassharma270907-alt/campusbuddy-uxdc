import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT, 10) || 8085;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.ics': 'text/calendar; charset=utf-8'
};

const STATIC_EXTENSIONS = new Set(Object.keys(MIME_TYPES));

function createServer() {
  return http.createServer((req, res) => {
    const startTime = Date.now();

    // Standard production security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Only allow GET and HEAD methods for static web service
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, {
        'Content-Type': 'application/json; charset=utf-8',
        'Allow': 'GET, HEAD'
      });
      res.end(JSON.stringify({ error: 'Method Not Allowed', allowed: ['GET', 'HEAD'] }));
      return;
    }

    const rawUrl = req.url || '/';
    // Null-byte poisoning protection
    if (rawUrl.includes('\0') || rawUrl.includes('%00')) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Bad Request: Null byte detected in URI' }));
      return;
    }

    // Safe URI decoding with error handling
    let reqPath;
    try {
      reqPath = decodeURIComponent(rawUrl.split('?')[0]);
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Bad Request: Malformed URI sequence' }));
      return;
    }

    if (reqPath.includes('\0')) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Bad Request: Null byte detected in URI' }));
      return;
    }

  // Dedicated /favicon.ico handler for browsers
  if (reqPath === '/favicon.ico') {
    const iconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>`;
    res.writeHead(200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    });
    if (req.method === 'HEAD') {
      res.end();
    } else {
      res.end(iconSvg);
    }
    return;
  }

  // First-class health check endpoints for Render and orchestration probes
  if (reqPath === '/health' || reqPath === '/healthz') {
    const payload = JSON.stringify({
      status: 'ok',
      service: 'campusbuddy',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    if (req.method === 'HEAD') {
      res.end();
    } else {
      res.end(payload);
    }
    return;
  }

  // Normalize route
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const normalized = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, '');
  const segments = normalized.split(/[/\\]/).filter(Boolean);

  // Security guard: Block direct access to hidden files and dot-directories (.git, .env, .github, etc.)
  if (segments.some(seg => seg.startsWith('.'))) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  const filePath = path.join(PUBLIC_DIR, normalized);

  // Prevent directory traversal outside of PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  // Security guard: Block direct access to sensitive repository configuration files
  const BLOCKED_FILES = new Set(['render.yaml', 'package.json', 'package-lock.json', '.env', '.env.example']);
  const baseName = path.basename(filePath).toLowerCase();
  if (BLOCKED_FILES.has(baseName)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  const reqExt = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If the request targeted a specific static file with an extension, return 404 instead of HTML fallback
      if (reqExt && STATIC_EXTENSIONS.has(reqExt) && reqExt !== '.html') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }

      // Fallback to index.html for SPA-style client routing
      const fallback = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(fallback, (fErr, content) => {
        if (fErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache'
          });
          if (req.method === 'HEAD') {
            res.end();
          } else {
            res.end(content);
          }
        }
      });
      return;
    }

    const contentType = MIME_TYPES[reqExt] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': reqExt === '.html' ? 'no-cache' : 'public, max-age=3600'
      });

      if (req.method === 'HEAD') {
        res.end();
      } else {
        res.end(content);
      }
    });
  });
  });
}

const server = createServer();

// Graceful shutdown handling for container and cloud environments
const handleShutdown = (signal) => {
  console.log(`\n[CampusBuddy] Received ${signal}. Gracefully closing HTTP server...`);
  server.close(() => {
    console.log('[CampusBuddy] HTTP server closed cleanly. Exiting.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

// Only listen if executed directly
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  server.listen(PORT, HOST, () => {
    console.log(`[CampusBuddy] Server running on http://${HOST}:${PORT}`);
  });
}

export { server, createServer, MIME_TYPES, PORT, HOST };
