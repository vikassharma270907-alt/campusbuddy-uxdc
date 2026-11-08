import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('CampusBuddy Single-File Prototype Integrity', () => {
  const htmlPath = path.resolve(__dirname, '../campusbuddy.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  test('campusbuddy.html file exists and has healthy size', () => {
    assert.ok(htmlContent.length > 5000, 'HTML file should be comprehensive');
  });

  test('index.html and campusbuddy.html are identical in content', () => {
    const indexPath = path.resolve(__dirname, '../index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    assert.equal(indexContent, htmlContent, 'index.html and campusbuddy.html must be kept strictly identical');
  });

  test('All required meta tags, viewport, fonts, and title are present', () => {
    assert.match(htmlContent, /<meta name="viewport" content="width=device-width/);
    assert.match(htmlContent, /<title>CampusBuddy/);
    assert.match(htmlContent, /Bricolage\+Grotesque/);
    assert.match(htmlContent, /Figtree/);
  });

  test('Extract and compile embedded JavaScript without syntax errors', () => {
    const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
    assert.ok(scriptMatch, 'Must contain a <script> block');
    const scriptCode = scriptMatch[1];

    // Mock minimal browser globals for vm syntax checking
    const sandbox = {
      window: { scrollTo: () => {} },
      document: {
        documentElement: { setAttribute: () => {} },
        querySelector: () => ({ innerHTML: '', classList: { add: () => {}, remove: () => {} }, setAttribute: () => {} }),
        addEventListener: () => {},
        activeElement: null
      },
      localStorage: {
        getItem: () => null,
        setItem: () => {}
      },
      setInterval: () => {},
      setTimeout: () => 1,
      clearTimeout: () => {},
      Date,
      Math,
      JSON,
      navigator: { clipboard: { writeText: async () => {} } }
    };

    const script = new vm.Script(scriptCode);
    assert.doesNotThrow(() => {
      script.runInNewContext(sandbox);
    }, 'Script should compile and run without runtime exceptions in sandbox');
  });

  test('Theme toggle and CSS variable tokens are defined for Light and Dark modes', () => {
    assert.match(htmlContent, /:root\s*\{[^}]*--pine:/);
    assert.match(htmlContent, /:root\[data-theme="dark"\]\s*\{[^}]*--pine:/);
    assert.match(htmlContent, /data-a="theme"/, 'Must have theme toggle button in UI');
  });

  test('The 90-Second Micro-Connection journey is implemented with real timer & flow', () => {
    assert.match(htmlContent, /90-Second Micro-Connection Sprint/);
    assert.match(htmlContent, /id="clk"/, 'Must have live clock display element');
    assert.match(htmlContent, /data-a="quick"/, 'Must have quick 90s flow trigger button');
    assert.match(htmlContent, /From “nobody to study with” to confirmed plan in/);
  });

  test('Safe campus public spots are verified and disclaimers are present', () => {
    assert.match(htmlContent, /Taylor Family Digital Library/);
    assert.match(htmlContent, /MacEwan Student Centre/);
    assert.match(htmlContent, /Science Theatres/);
    assert.match(htmlContent, /Fictional Demo|fictional/i);
    assert.match(htmlContent, /This design prototype has no live moderator/);
  });

  test('WCAG AA accessibility landmarks, ARIA attributes and roles are verified', () => {
    assert.match(htmlContent, /aria-modal="true"/, 'Modal must have aria-modal="true"');
    assert.match(htmlContent, /role="dialog"/, 'Modal must have role="dialog"');
    assert.match(htmlContent, /role="status"/, 'Toast must have role="status"');
    assert.match(htmlContent, /aria-live="polite"/, 'Live region must have aria-live="polite"');
    assert.match(htmlContent, /:focus-visible/, 'Focus ring style must be defined for keyboard navigation');
    assert.match(htmlContent, /prefers-reduced-motion/, 'Reduced motion media query must be present');
  });

  test('All required actions (A object) are defined', () => {
    const expectedActions = [
      'home', 'theme', 'quick', 'study', 'sl', 'start', 'tab',
      'chip', 'obdone', 'modal', 'modal_close', 'shuffle_starter',
      'copy_details', 'export_ics', 'join', 'invite', 'resp', 'leave', 'cancel',
      'done', 'fbp', 'fb', 'clear_filters', 'tpl', 'create', 'vis', 'block',
      'unblock', 'report', 'reset'
    ];

    expectedActions.forEach(act => {
      const regex = new RegExp(`\\b${act}\\s*\\(`);
      assert.ok(regex.test(htmlContent), `Action handler "${act}" should exist in A`);
    });
  });

  test('Progressive Web App (PWA) manifest and service worker exist with valid configuration', () => {
    const manifestPath = path.resolve(__dirname, '../manifest.webmanifest');
    assert.ok(fs.existsSync(manifestPath), 'manifest.webmanifest must exist');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(manifest.name, 'CampusBuddy');
    assert.equal(manifest.display, 'standalone');
    assert.ok(manifest.icons && manifest.icons.length > 0);

    const swPath = path.resolve(__dirname, '../sw.js');
    assert.ok(fs.existsSync(swPath), 'sw.js service worker must exist');
    const swContent = fs.readFileSync(swPath, 'utf8');
    assert.match(swContent, /addEventListener\('install'/);
    assert.match(swContent, /addEventListener\('fetch'/);
  });
});

