import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { server } from '../server.js';

describe('CampusBuddy Production HTTP Server', () => {
  const TEST_PORT = 8992;

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

  const get = (urlPath) => new Promise((resolve, reject) => {
    http.get(`http://localhost:${TEST_PORT}${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });

  test('GET / serves index.html with 200 OK and security headers', async () => {
    const res = await get('/');
    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /text\/html/);
    assert.equal(res.headers['x-content-type-options'], 'nosniff');
    assert.equal(res.headers['x-frame-options'], 'SAMEORIGIN');
    assert.match(res.body, /<title>CampusBuddy/);
    assert.match(res.body, /90-Second Micro-Connection Sprint/);
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
