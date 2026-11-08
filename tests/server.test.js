import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createServer } from '../server.js';

describe('CampusBuddy Production HTTP Server', () => {
  const TEST_PORT = 8992;
  const server = createServer();

  before(async () => {
    await new Promise((resolve, reject) => {
      server.listen(TEST_PORT, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });

  const request = (urlPath, options = {}) => new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:${TEST_PORT}${urlPath}`, options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.end();
  });

  const get = (urlPath) => request(urlPath, { method: 'GET' });

  test('GET / serves index.html with 200 OK and security headers', async () => {
    const res = await get('/');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /text\/html/);
    assert.equal(res.headers['x-content-type-options'], 'nosniff');
    assert.equal(res.headers['x-frame-options'], 'SAMEORIGIN');
    assert.equal(res.headers['referrer-policy'], 'strict-origin-when-cross-origin');
    assert.match(res.headers['permissions-policy'], /geolocation=/);
    assert.match(res.body, /<title>CampusBuddy/);
    assert.match(res.body, /90-Second Micro-Connection Sprint/);
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
    assert.equal(res.headers.allow, 'GET, HEAD');
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

  test('GET /package-lock.json returns 403 Forbidden', async () => {
    const res = await get('/package-lock.json');
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

  test('GET /DESIGN.md returns markdown with correct MIME type', async () => {
    const res = await get('/DESIGN.md');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /text\/markdown/);
    assert.match(res.body, /Design System/);
  });

  test('GET /non-existent-route returns index.html fallback for SPA routing', async () => {
    const res = await get('/study-session-view');
    assert.equal(res.status, 200);
    assert.match(res.body, /<title>CampusBuddy/);
  });
});
