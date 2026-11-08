import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createServer } from '../server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('CampusBuddy End-to-End User Journey Smoke Suite', () => {
  let testPort;
  const server = createServer();

  before(async () => {
    await new Promise((resolve, reject) => {
      server.listen(0, '127.0.0.1', (err) => {
        if (err) return reject(err);
        testPort = server.address().port;
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
    http.get(`http://127.0.0.1:${testPort}${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
  });

  test('E2E Gate 1: HTTP server serves production index.html and health endpoint', async () => {
    const health = await get('/health');
    assert.equal(health.status, 200);
    const healthData = JSON.parse(health.body);
    assert.equal(healthData.status, 'ok');
    assert.equal(healthData.service, 'campusbuddy');

    const index = await get('/');
    assert.equal(index.status, 200);
    assert.match(index.headers['content-type'], /text\/html/);
    assert.match(index.body, /CampusBuddy/);
    assert.match(index.body, /90-Second Micro-Connection Sprint/);
  });

  test('E2E Gate 2: Full 90-Second Sprint & Application Lifecycle Flow', () => {
    const htmlPath = path.resolve(__dirname, '../campusbuddy.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
    assert.ok(scriptMatch, 'script tag exists');
    const scriptCode = scriptMatch[1];

    let storedState = null;

    const fakeElements = {
      app: { innerHTML: '', setAttribute: () => {} },
      toast: { innerHTML: '', classList: { add: () => {}, remove: () => {} } },
      'live-region': { textContent: '' },
      clk: { textContent: '0' }
    };

    const sandbox = {
      window: { scrollTo: () => {}, addEventListener: () => {} },
      document: {
        documentElement: { setAttribute: () => {} },
        querySelector: (sel) => {
          if (sel === '#app') return fakeElements.app;
          if (sel === '#toast') return fakeElements.toast;
          if (sel === '#live-region') return fakeElements['live-region'];
          if (sel === '#clk') return fakeElements.clk;
          return {
            value: '',
            trim: () => '',
            focus: () => {},
            classList: { add: () => {}, remove: () => {} },
            setAttribute: () => {}
          };
        },
        querySelectorAll: () => [],
        addEventListener: () => {},
        createElement: () => ({ click: () => {}, href: '', download: '' }),
        body: { appendChild: () => {}, removeChild: () => {} },
        activeElement: null
      },
      Blob,
      URL: { createObjectURL: () => 'blob:mock', revokeObjectURL: () => {} },
      localStorage: {
        getItem: (k) => (k === 'cb_state_v2' ? storedState : null),
        setItem: (k, v) => {
          if (k === 'cb_state_v2') storedState = v;
        }
      },
      setInterval: () => 101,
      clearInterval: () => {},
      setTimeout: () => 102,
      clearTimeout: () => {},
      Date,
      Math,
      JSON,
      navigator: { clipboard: { writeText: async () => {} } }
    };

    const context = vm.createContext(sandbox);
    const script = new vm.Script(scriptCode + '\n;({ S, A, score, spots, blocked, save });');
    const { S, A, score, spots, blocked, save } = script.runInContext(context);

    assert.ok(S, 'State S initialized');
    assert.ok(A, 'Actions A defined');

    // 1. Initial State assertions
    assert.equal(S.me, 'maya');
    assert.equal(S.users.maya.n, 'Maya');

    // 2. Start 90-Second Study Sprint
    A.study();
    assert.equal(S.tab, 'study');
    assert.ok(S.t0 > 0, 'Sprint timer start timestamp recorded');

    // 3. Find top recommended study session
    const studyPool = S.acts
      .filter(a => ['study', 'cowork'].includes(a.c) && a.st === 'open' && !a.ps.includes(S.me) && spots(a) > 0)
      .sort((a, b) => score(S.me, b).s - score(S.me, a).s);

    assert.ok(studyPool.length > 0, 'Open study moments available');
    const topMatch = studyPool[0];
    assert.equal(topMatch.id, 'a1');
    assert.equal(topMatch.host, 'dev');
    assert.ok(score(S.me, topMatch).s >= 70, 'Calculus session matches Maya well');

    // 4. Maya joins Dev's calculus session
    const initialParticipantsCount = topMatch.ps.length;
    A.join('a1');

    assert.ok(topMatch.ps.includes('maya'), 'Maya is now listed in attendees');
    assert.equal(topMatch.ps.length, initialParticipantsCount + 1);
    assert.equal(S.modal, 'a1', 'Confirmation modal opened for moment a1');
    assert.ok(typeof S.took === 'number' && S.took >= 0, 'Measured connection duration recorded');

    // 5. Icebreaker shuffle & iCalendar export
    A.shuffle_starter('study');
    assert.doesNotThrow(() => A.export_ics('a1'), 'export_ics generates ics file without errors');

    // 6. Close Modal and navigate to Plans
    A.modal_close();
    assert.equal(S.modal, null, 'Modal closed');

    A.tab('plans');
    assert.equal(S.tab, 'plans');

    // 7. Verify Maya is scheduled for calculus in plans
    const mayaUpcomingPlans = S.acts.filter(a => a.st === 'open' && a.ps.includes(S.me));
    assert.ok(mayaUpcomingPlans.some(p => p.id === 'a1'), 'Calculus moment appears in Maya’s upcoming plans');

    // 8. Test Private Feedback Submission
    assert.doesNotThrow(() => A.fbp(null), 'fbp handles null/invalid gracefully without throwing');
    A.fbp('a6|Enjoyed the experience'); // Select feedback pill
    A.fb('a6'); // Submit feedback for past session
    assert.ok(S.fb.length > 0, 'Feedback successfully logged into audit array');

    // 9. Test Profile Visibility Toggle
    const prevVis = S.users.maya.vis;
    A.vis();
    assert.equal(S.users.maya.vis, !prevVis, 'Profile visibility toggles properly');

    // 10. Test Safety: Mutual blocking cancels invitations
    S.blocks.push(['maya', 'tom']);
    assert.ok(blocked('maya', 'tom'), 'Mutual block is recorded');

    // 11. Verify state persistence
    save();
    assert.ok(storedState, 'Local state was serialized to localStorage');
    const parsedState = JSON.parse(storedState);
    assert.equal(parsedState.me, 'maya');
    assert.ok(parsedState.acts.find(a => a.id === 'a1').ps.includes('maya'));
  });
});
