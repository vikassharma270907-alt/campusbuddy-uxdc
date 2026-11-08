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

describe('CampusBuddy Production HTTP Server', () => {
  let testPort;
  const server = createServer();

  before(async () => {
    fs.writeFileSync(sampleAudioPath, Buffer.from('ID3v2.4.0-campusbuddy-test-audio'));
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
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });

  const request = (urlPath, options = {}) => new Promise((resolve, reject) => {
    const req = http.request(`http://127.0.0.1:${testPort}${urlPath}`, options, (res) => {
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
    req.end();
  });

  const get = (urlPath, headers = {}) => request(urlPath, { method: 'GET', headers });

  test('GET / serves index.html with 200 OK and security headers', async () => {
    const res = await get('/');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /text\/html/);
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
    const decompressed = await gunzip(res.rawBuffer);
    assert.match(decompressed.toString('utf8'), /<title>CampusBuddy/);
  });

  test('OPTIONS / returns 204 No Content with Allow headers', async () => {
    const res = await request('/', { method: 'OPTIONS' });
    assert.equal(res.status, 204);
    assert.match(res.headers.allow, /GET, HEAD, OPTIONS/);
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

  test('GET /nonexistent-image.png returns 404 Not Found instead of SPA fallback', async () => {
    const res = await get('/nonexistent-image.png');
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
    const res = await get('/sample-test.mp3');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /audio\/mpeg/);
    assert.ok(res.rawBuffer.length > 0);
  });

  test('GET /non-existent-route returns index.html fallback for SPA routing', async () => {
    const res = await get('/study-session-view');
    assert.equal(res.status, 200);
    assert.match(res.body, /<title>CampusBuddy/);
  });
});
