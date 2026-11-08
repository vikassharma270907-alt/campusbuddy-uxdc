import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createServer } from '../server.js';

const gunzip = promisify(zlib.gunzip);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sampleAudioPath = path.resolve(__dirname, '../sample-test.mp3');
const sampleVideoPath = path.resolve(__dirname, '../campusbuddy_showcase.mp4');

describe('CampusBuddy Production HTTP Server', () => {
  let testPort;
  let createdVideoFixture = false;
  const server = createServer();

  before(async () => {
    fs.writeFileSync(sampleAudioPath, Buffer.from('ID3v2.4.0-campusbuddy-test-audio'));
    if (!fs.existsSync(sampleVideoPath)) {
      fs.writeFileSync(sampleVideoPath, Buffer.from('ftypmp42isommp42-campusbuddy-test-video-stream-payload'));
      createdVideoFixture = true;
    }
    await new Promise((resolve, reject) => {
      server.listen(0, '127.0.0.1', (err) => {
        if (err) return reject(err);
        testPort = server.address().port;
        resolve();
      });
    });
  });

  after(async () => {
    if (fs.existsSync(sampleAudioPath)) {
      try { fs.unlinkSync(sampleAudioPath); } catch {}
    }
    if (createdVideoFixture && fs.existsSync(sampleVideoPath)) {
      try { fs.unlinkSync(sampleVideoPath); } catch {}
    }
    if (typeof server.closeAllConnections === 'function') {
      server.closeAllConnections();
    }
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });

  const request = (urlPath, options = {}) => new Promise((resolve, reject) => {
    const reqOptions = {
      host: '127.0.0.1',
      port: testPort,
      path: urlPath,
      method: options.method || 'GET',
      headers: options.headers || {}
    };
    const req = http.request(reqOptions, (res) => {
      const chunks = [];
      res.on('data', chunk => { chunks.push(chunk); });
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          status: res.statusCode,
          headers: res.headers,
          rawBuffer: buffer,
          body: buffer.toString('utf8')
        });
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });

  const get = (urlPath, headers = {}) => request(urlPath, { method: 'GET', headers });
  const post = (urlPath, body = {}, headers = {}) => request(urlPath, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json', ...headers }
  });

  test('GET / serves index.html with 200 OK, CORS, and security headers', async () => {
    const res = await get('/');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /text\/html/);
    assert.equal(res.headers['access-control-allow-origin'], '*');
    assert.equal(res.headers['vary'], 'Accept-Encoding');
    assert.equal(res.headers['x-content-type-options'], 'nosniff');
    assert.equal(res.headers['x-frame-options'], 'SAMEORIGIN');
    assert.equal(res.headers['referrer-policy'], 'strict-origin-when-cross-origin');
    assert.equal(res.headers['cross-origin-opener-policy'], 'same-origin');
    assert.equal(res.headers['x-xss-protection'], '1; mode=block');
    assert.match(res.headers['content-security-policy'], /default-src/);
    assert.match(res.headers['permissions-policy'], /geolocation=/);
    assert.match(res.body, /<title>CampusBuddy/);
    assert.match(res.body, /90-Second Micro-Connection Sprint/);
  });

  test('GET / with Accept-Encoding: gzip compresses response transparently', async () => {
    const res = await get('/', { 'Accept-Encoding': 'gzip' });
    assert.equal(res.status, 200);
    assert.equal(res.headers['content-encoding'], 'gzip');
    assert.equal(res.headers['vary'], 'Accept-Encoding');
    const decompressed = await gunzip(res.rawBuffer);
    assert.match(decompressed.toString('utf8'), /<title>CampusBuddy/);
  });

  test('OPTIONS / returns 204 No Content with CORS preflight and Allow headers', async () => {
    const res = await request('/', { method: 'OPTIONS' });
    assert.equal(res.status, 204);
    assert.match(res.headers.allow, /GET, HEAD, OPTIONS/);
    assert.equal(res.headers['access-control-allow-origin'], '*');
    assert.equal(res.headers['access-control-allow-methods'], 'GET, HEAD, OPTIONS');
    assert.equal(res.headers['access-control-allow-headers'], '*');
  });

  test('GET /health returns 200 OK with valid JSON status payload', async () => {
    const res = await get('/health');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /application\/json/);
    const data = JSON.parse(res.body);
    assert.equal(data.status, 'ok');
    assert.equal(data.service, 'campusbuddy');
    assert.equal(typeof data.uptime, 'number');
    assert.ok(data.timestamp);
  });

  test('GET /favicon.ico returns 200 OK with valid SVG icon payload', async () => {
    const res = await get('/favicon.ico');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /image\/svg\+xml/);
    assert.match(res.body, /<svg/);
  });

  test('GET /healthz returns 200 OK matching kubernetes/cloud standard', async () => {
    const res = await get('/healthz');
    assert.equal(res.status, 200);
    const data = JSON.parse(res.body);
    assert.equal(data.status, 'ok');
  });

  test('HEAD /health returns 200 OK with empty body', async () => {
    const res = await request('/health', { method: 'HEAD' });
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /application\/json/);
    assert.equal(res.body, '');
  });

  test('POST / returns 405 Method Not Allowed', async () => {
    const res = await request('/', { method: 'POST' });
    assert.equal(res.status, 405);
    assert.match(res.headers.allow, /GET, HEAD, OPTIONS/);
  });

  test('GET /.git/config returns 403 Forbidden', async () => {
    const res = await get('/.git/config');
    assert.equal(res.status, 403);
    assert.match(res.body, /Forbidden/);
  });

  test('GET /render.yaml returns 403 Forbidden', async () => {
    const res = await get('/render.yaml');
    assert.equal(res.status, 403);
    assert.match(res.body, /Forbidden/);
  });

  test('GET /vercel.json returns 403 Forbidden', async () => {
    const res = await get('/vercel.json');
    assert.equal(res.status, 403);
    assert.match(res.body, /Forbidden/);
  });

  test('GET /.coderabbit.yaml returns 403 Forbidden', async () => {
    const res = await get('/.coderabbit.yaml');
    assert.equal(res.status, 403);
    assert.match(res.body, /Forbidden/);
  });

  test('GET /package-lock.json returns 403 Forbidden', async () => {
    const res = await get('/package-lock.json');
    assert.equal(res.status, 403);
    assert.match(res.body, /Forbidden/);
  });

  test('GET /server.js returns 403 Forbidden (source code protection)', async () => {
    const res = await get('/server.js');
    assert.equal(res.status, 403);
    assert.match(res.body, /Forbidden/);
  });

  test('GET /scripts/sync-html.js returns 403 Forbidden (internal scripts blocked)', async () => {
    const res = await get('/scripts/sync-html.js');
    assert.equal(res.status, 403);
    assert.match(res.body, /Forbidden/);
  });

  test('GET /tests/server.test.js returns 403 Forbidden (test harness blocked)', async () => {
    const res = await get('/tests/server.test.js');
    assert.equal(res.status, 403);
    assert.match(res.body, /Forbidden/);
  });

  test('Path traversal attempt with .. returns 403 Forbidden', async () => {
    const res = await request('/../../etc/passwd');
    assert.equal(res.status, 403);
    assert.match(res.body, /Forbidden/);
  });

  test('GET /node_modules returns 403 Forbidden', async () => {
    const res = await get('/node_modules');
    assert.equal(res.status, 403);
    assert.match(res.body, /Forbidden/);
  });

  test('GET /nonexistent-image.png returns 404 Not Found instead of SPA fallback', async () => {
    const res = await get('/nonexistent-image.png');
    assert.equal(res.status, 404);
  });

  test('GET /missing-asset.xyz with arbitrary non-HTML extension returns 404 Not Found', async () => {
    const res = await get('/missing-asset.xyz');
    assert.equal(res.status, 404);
  });

  test('Malformed URI sequence returns 400 Bad Request', async () => {
    const res = await get('/%E0%A4%A');
    assert.equal(res.status, 400);
    const data = JSON.parse(res.body);
    assert.match(data.error, /Bad Request/);
  });

  test('Null-byte sequence returns 400 Bad Request', async () => {
    const res = await get('/index.html%00.png');
    assert.equal(res.status, 400);
    const data = JSON.parse(res.body);
    assert.match(data.error, /Null byte/);
  });

  test('GET /campusbuddy.html directly serves the standalone prototype', async () => {
    const res = await get('/campusbuddy.html');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /text\/html/);
    assert.match(res.body, /CampusBuddy/);
  });

  test('GET /manifest.webmanifest returns 200 OK with correct MIME type', async () => {
    const res = await get('/manifest.webmanifest');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /application\/manifest\+json/);
    const data = JSON.parse(res.body);
    assert.equal(data.name, 'CampusBuddy');
  });

  test('GET /sw.js returns 200 OK with javascript MIME type and no-cache control', async () => {
    const res = await get('/sw.js');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /application\/javascript/);
    assert.match(res.headers['cache-control'], /no-cache/);
    assert.match(res.body, /addEventListener/);
  });

  test('GET /DESIGN.md returns markdown with correct MIME type', async () => {
    const res = await get('/DESIGN.md');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /text\/markdown/);
    assert.match(res.body, /Design System/);
  });

  test('GET /sample-test.mp3 returns 200 OK with audio/mpeg MIME type', async () => {
    fs.writeFileSync(sampleAudioPath, Buffer.from('ID3v2.4.0-campusbuddy-test-audio'));
    try {
      const res = await get('/sample-test.mp3');
      assert.equal(res.status, 200);
      assert.match(res.headers['content-type'], /audio\/mpeg/);
      assert.ok(res.rawBuffer.length > 0);
    } finally {
      if (fs.existsSync(sampleAudioPath)) {
        try { fs.unlinkSync(sampleAudioPath); } catch {}
      }
    }
  });

  test('GET /campusbuddy_showcase.mp4 returns 200 OK with video/mp4 MIME type and Accept-Ranges', async () => {
    const res = await get('/campusbuddy_showcase.mp4');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /video\/mp4/);
    assert.equal(res.headers['accept-ranges'], 'bytes');
    assert.ok(res.rawBuffer.length > 0);
  });

  test('GET /campusbuddy_showcase.mp4 with Range header returns 206 Partial Content', async () => {
    const res = await get('/campusbuddy_showcase.mp4', { Range: 'bytes=0-99' });
    assert.equal(res.status, 206);
    assert.match(res.headers['content-type'], /video\/mp4/);
    assert.equal(res.headers['accept-ranges'], 'bytes');
    assert.match(res.headers['content-range'], /^bytes 0-99\/\d+$/);
    assert.equal(res.headers['content-length'], '100');
    assert.equal(res.rawBuffer.length, 100);
  });

  test('GET /campusbuddy_showcase.mp4 with invalid Range header returns 416 Range Not Satisfiable', async () => {
    const res = await get('/campusbuddy_showcase.mp4', { Range: 'bytes=999999999-999999999' });
    assert.equal(res.status, 416);
    assert.match(res.headers['content-range'], /^bytes \*\/\d+$/);
  });

  test('GET /calendar.ics returns 200 OK with text/calendar MIME type and valid VCALENDAR payload', async () => {
    const res = await get('/calendar.ics');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /text\/calendar/);
    assert.match(res.headers['content-disposition'], /inline; filename="campusbuddy\.ics"/);
    assert.match(res.body, /BEGIN:VCALENDAR/);
    assert.match(res.body, /PRODID:-\/\/CampusBuddy\/\/UXDC 2026\/\/EN/);
    assert.match(res.body, /BEGIN:VEVENT/);
    assert.match(res.body, /END:VCALENDAR/);
  });

  test('HEAD /calendar.ics returns 200 OK with empty body', async () => {
    const res = await request('/calendar.ics', { method: 'HEAD' });
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /text\/calendar/);
    assert.equal(res.body, '');
  });

  test('GET /api/spots returns 200 OK with verified campus zones and metrics', async () => {
    const res = await get('/api/spots');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /application\/json/);
    const data = JSON.parse(res.body);
    assert.equal(data.status, 'ok');
    assert.equal(data.campus, 'University of Calgary');
    assert.equal(data.spots.length, 6);
    assert.ok(data.spots.some(s => s.id === 'tfdl' && s.busyness > 0));
    assert.ok(data.spots.some(s => s.id === 'macewan' && s.type === 'Social'));
  });

  test('GET /api/wellbeing returns 200 OK with institutional campus telemetry', async () => {
    const res = await get('/api/wellbeing');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /application\/json/);
    const data = JSON.parse(res.body);
    assert.equal(data.campus, 'University of Calgary');
    assert.ok(data.activeMomentsToday >= 0);
    assert.equal(data.lonelinessReductionIndex, '+42%');
    assert.ok(Array.isArray(data.topLandmarks));
  });

  test('POST /api/broadcast accepts and distributes event to connected listeners', async () => {
    const res = await post('/api/broadcast', {
      event: 'moment:created',
      data: { id: 'test_moment_99', title: 'Calculus Review Sprint' }
    });
    assert.equal(res.status, 200);
    const data = JSON.parse(res.body);
    assert.equal(data.ok, true);
    assert.ok(typeof data.deliveredTo === 'number');
  });

  test('GET /events initiates native SSE stream with event-stream headers', async () => {
    const http = await import('node:http');
    const sseRes = await new Promise((resolve, reject) => {
      const req = http.get(`http://127.0.0.1:${testPort}/events`, (res) => {
        resolve({
          status: res.statusCode,
          contentType: res.headers['content-type'],
          cacheControl: res.headers['cache-control']
        });
        res.destroy();
        req.destroy();
      });
      req.on('error', (err) => {
        if (err.code !== 'ECONNRESET') reject(err);
      });
    });
    assert.equal(sseRes.status, 200);
    assert.match(sseRes.contentType, /text\/event-stream/);
    assert.match(sseRes.cacheControl, /no-cache/);
  });

  test('GET /non-existent-route returns index.html fallback for SPA routing', async () => {
    const res = await get('/study-session-view');
    assert.equal(res.status, 200);
    assert.match(res.body, /<title>CampusBuddy/);
  });
});
