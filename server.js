import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
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
  '.ics': 'text/calendar; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const STATIC_EXTENSIONS = new Set(Object.keys(MIME_TYPES));
const COMPRESSIBLE_EXTENSIONS = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.txt', '.md', '.webmanifest', '.ics']);
const BLOCKED_FILES = new Set(['render.yaml', 'vercel.json', 'package.json', 'package-lock.json', '.env', '.env.example', 'server.js', '.coderabbit.yaml']);
const BLOCKED_DIRS = new Set(['tests', 'scripts', '.git', '.github', '.vscode', '.agents', 'node_modules', 'etc', 'proc', 'sys', 'dev']);

const sseClients = new Set();

function broadcastSSE(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

function getWellbeingStats() {
  return {
    campus: 'University of Calgary',
    activeMomentsToday: 42,
    sprintSuccessRate: 0.91,
    topLandmarks: [
      { name: 'TFDL Commons', activeSpots: 18, vibe: 'Morning Focus' },
      { name: 'MacEwan Food Court', activeSpots: 14, vibe: 'Midday Collab' },
      { name: 'Science Theatres Concourse', activeSpots: 10, vibe: 'Study Sprint' }
    ],
    disconnectionGapIdentified: '14:15 - 15:30 (Post-Lecture Void)',
    lonelinessReductionIndex: '+42%',
    updatedAt: new Date().toISOString()
  };
}

function handleRequest(req, res) {
    // Production security & isolation headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' 'unsafe-inline' data: https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;"
    );

    // Support CORS preflight
    if (req.method === 'OPTIONS') {
      const isApi = (req.url || '').startsWith('/api');
      const allowMethods = isApi ? 'GET, HEAD, POST, OPTIONS' : 'GET, HEAD, OPTIONS';
      res.writeHead(204, {
        'Allow': allowMethods,
        'Access-Control-Allow-Methods': allowMethods,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      });
      res.end();
      return;
    }

    const rawUrl = req.url || '/';

    // Only allow GET, HEAD, and authorized POST endpoints
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const isPostAllowed = req.method === 'POST' && (rawUrl.startsWith('/api/broadcast') || rawUrl.startsWith('/api/wellbeing'));
      if (!isPostAllowed) {
        res.writeHead(405, {
          'Content-Type': 'application/json; charset=utf-8',
          'Allow': 'GET, HEAD, OPTIONS'
        });
        res.end(JSON.stringify({ error: 'Method Not Allowed', allowed: ['GET', 'HEAD', 'OPTIONS'] }));
        return;
      }
    }
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

    // Security guard: Detect directory traversal sequences
    if (rawUrl.includes('..') || reqPath.includes('..')) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 Forbidden');
      return;
    }

    // Dedicated /favicon.ico handler for browsers
    if (reqPath === '/favicon.ico') {
      const iconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>`;
      res.writeHead(200, {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800'
      });
      if (req.method === 'HEAD') {
        res.end();
      } else {
        res.end(iconSvg);
      }
      return;
    }

    // First-class health check endpoints for Render and orchestration probes
    if (reqPath === '/health' || reqPath === '/healthz' || reqPath === '/health.json' || reqPath === '/healthz.json') {
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

    // Dynamic RFC 5545 iCalendar stream
    if (reqPath === '/calendar.ics') {
      const pad = n => String(n).padStart(2, '0');
      const formatIcsDate = d =>
        `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
      const now = new Date();
      const dtStamp = formatIcsDate(now);
      const icsData = [
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

      res.writeHead(200, {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'inline; filename="campusbuddy.ics"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      });
      if (req.method === 'HEAD') {
        res.end();
      } else {
        res.end(icsData);
      }
      return;
    }

    // Dynamic /api/spots endpoint for spatial status and live telemetry
    if (reqPath === '/api/spots' || reqPath === '/api/spots.json') {
      const payload = JSON.stringify({
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
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        'Access-Control-Allow-Origin': '*'
      });
      if (req.method === 'HEAD') {
        res.end();
      } else {
        res.end(payload);
      }
      return;
    }

    // Institutional wellbeing & loneliness reduction telemetry endpoint
    if (reqPath === '/api/wellbeing') {
      const wellbeingPayload = JSON.stringify(getWellbeingStats(), null, 2);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=120',
        'Access-Control-Allow-Origin': '*'
      });
      if (req.method === 'HEAD') {
        res.end();
      } else {
        res.end(wellbeingPayload);
      }
      return;
    }

    // Server-Sent Events (SSE) live connection stream
    if (reqPath === '/events' || reqPath === '/api/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      res.write(': heartbeat\n\n');
      res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', clients: sseClients.size + 1, timestamp: new Date().toISOString() })}\n\n`);
      sseClients.add(res);

      req.on('close', () => {
        sseClients.delete(res);
        try { res.end(); } catch {}
      });
      return;
    }

    // Realtime broadcast endpoint (POST)
    if (reqPath === '/api/broadcast' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 65536) req.destroy();
      });
      req.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          broadcastSSE(parsed.event || 'message', parsed.data || {});
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({ ok: true, deliveredTo: sseClients.size }));
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }

    // Normalize route
    if (reqPath === '/' || reqPath === '') {
      reqPath = '/index.html';
    }

    const normalized = path.normalize(reqPath);
    const segments = normalized.split(/[/\\]/).filter(Boolean);

    // Security guard: Block direct access to hidden files and internal directories
    if (segments.some(seg => seg.startsWith('.') || BLOCKED_DIRS.has(seg.toLowerCase()))) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 Forbidden');
      return;
    }

    const filePath = path.join(PUBLIC_DIR, normalized);
    const rel = path.relative(PUBLIC_DIR, filePath);

    // Prevent directory traversal outside of PUBLIC_DIR
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 Forbidden');
      return;
    }

    // Security guard: Block direct access to sensitive repository configuration files
    const baseName = path.basename(filePath).toLowerCase();
    if (BLOCKED_FILES.has(baseName)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 Forbidden');
      return;
    }

    const reqExt = path.extname(filePath).toLowerCase();

    // Helper to send response with optional Gzip compression
    const sendResponse = (statusCode, headers, content, ext) => {
      const acceptEncoding = req.headers['accept-encoding'] || '';
      const canGzip = acceptEncoding.includes('gzip') && COMPRESSIBLE_EXTENSIONS.has(ext);

      headers['Vary'] = 'Accept-Encoding';
      headers['Access-Control-Allow-Origin'] = '*';

      if (req.method === 'HEAD') {
        if (canGzip) headers['Content-Encoding'] = 'gzip';
        res.writeHead(statusCode, headers);
        res.end();
        return;
      }

      if (canGzip) {
        zlib.gzip(content, (zErr, compressed) => {
          if (zErr) {
            res.writeHead(statusCode, headers);
            res.end(content);
          } else {
            headers['Content-Encoding'] = 'gzip';
            headers['Content-Length'] = compressed.length;
            res.writeHead(statusCode, headers);
            res.end(compressed);
          }
        });
      } else {
        res.writeHead(statusCode, headers);
        res.end(content);
      }
    };

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        // If the request targeted a specific static file with an extension, return 404 instead of HTML fallback
        if (reqExt && reqExt !== '.html') {
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
            const headers = {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-cache, no-store, must-revalidate'
            };
            sendResponse(200, headers, content, '.html');
          }
        });
        return;
      }

      const contentType = MIME_TYPES[reqExt] || 'application/octet-stream';
      const isNoCache = reqExt === '.html' || baseName === 'sw.js';
      const cacheControl = isNoCache
        ? 'no-cache, no-store, must-revalidate'
        : 'public, max-age=86400, stale-while-revalidate=604800';

      // RFC 7233 byte-range request support (smooth video and audio streaming/seeking)
      const rangeHeader = req.headers.range;
      if (rangeHeader && rangeHeader.startsWith('bytes=')) {
        const parts = rangeHeader.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

        if (isNaN(start) || isNaN(end) || start > end || start >= stats.size) {
          res.writeHead(416, {
            'Content-Range': `bytes */${stats.size}`,
            'Content-Type': 'text/plain; charset=utf-8'
          });
          res.end('416 Range Not Satisfiable');
          return;
        }

        const chunksize = (end - start) + 1;
        const rangeHeaders = {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType,
          'Cache-Control': cacheControl
        };

        res.writeHead(206, rangeHeaders);
        if (req.method === 'HEAD') {
          res.end();
        } else {
          const stream = fs.createReadStream(filePath, { start, end });
          stream.on('error', () => {
            if (!res.headersSent) {
              res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
              res.end('500 Internal Server Error');
            }
          });
          stream.pipe(res);
        }
        return;
      }

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('500 Internal Server Error');
          return;
        }

        const headers = {
          'Content-Type': contentType,
          'Cache-Control': cacheControl,
          'Accept-Ranges': 'bytes'
        };
        sendResponse(200, headers, content, reqExt);
      });
    });
}

function createServer() {
  const srv = http.createServer(handleRequest);
  srv.on('error', (err) => {
    console.error('[CampusBuddy] HTTP Server Error:', err.message);
  });
  return srv;
}

const server = createServer();

// Graceful shutdown handling for container and cloud environments
const handleShutdown = (signal) => {
  console.log(`\n[CampusBuddy] Received ${signal}. Gracefully closing HTTP server...`);
  if (typeof server.closeIdleConnections === 'function') {
    server.closeIdleConnections();
  }
  server.close(() => {
    console.log('[CampusBuddy] HTTP server closed cleanly. Exiting.');
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 5000).unref();
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

// Only listen if executed directly
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  server.listen(PORT, HOST, () => {
    console.log(`[CampusBuddy] Server running on http://${HOST}:${PORT}`);
  });
}

export default function handler(req, res) {
  return handleRequest(req, res);
}

export { server, createServer, MIME_TYPES, PORT, HOST, handleRequest };
