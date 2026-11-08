const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body {
    width: 1200px;
    height: 800px;
    background: radial-gradient(circle at 15% 15%, #0e2d2a 0%, #09171d 55%, #04090c 100%);
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 55px 70px;
    position: relative;
    overflow: hidden;
  }
  .glow-1 {
    position: absolute;
    top: -100px;
    right: -60px;
    width: 550px;
    height: 550px;
    background: radial-gradient(circle, rgba(45, 212, 191, 0.28) 0%, rgba(10, 99, 90, 0) 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .glow-2 {
    position: absolute;
    bottom: -120px;
    left: 180px;
    width: 550px;
    height: 550px;
    background: radial-gradient(circle, rgba(217, 119, 6, 0.2) 0%, rgba(217, 119, 6, 0) 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 10;
  }
  .brand-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.16);
    padding: 8px 18px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #5eead4;
  }
  .brand-badge .dot {
    width: 8px;
    height: 8px;
    background: #2dd4bf;
    border-radius: 50%;
    box-shadow: 0 0 10px #2dd4bf;
  }
  .track-badge {
    background: rgba(245, 158, 11, 0.18);
    border: 1px solid rgba(245, 158, 11, 0.45);
    padding: 8px 18px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #fbbf24;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 1.18fr 0.82fr;
    gap: 40px;
    align-items: center;
    position: relative;
    z-index: 10;
  }
  .hero-left h1 {
    font-size: 66px;
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -1.5px;
    margin-bottom: 14px;
    background: linear-gradient(135deg, #ffffff 0%, #d8f5ef 45%, #2dd4bf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .hero-left .tagline {
    font-size: 24px;
    font-weight: 600;
    color: #cbd5e1;
    margin-bottom: 18px;
    line-height: 1.35;
  }
  .hero-left .tagline span {
    color: #fbbf24;
    font-weight: 800;
  }
  .hero-left .desc {
    font-size: 16px;
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 26px;
    max-width: 540px;
  }
  .pill-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .pill {
    background: rgba(15, 30, 38, 0.9);
    border: 1px solid rgba(45, 212, 191, 0.3);
    padding: 8px 15px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    color: #e2e8f0;
  }
  .mockup-card {
    background: linear-gradient(145deg, rgba(22, 40, 48, 0.96), rgba(11, 23, 29, 0.98));
    border: 1px solid rgba(45, 212, 191, 0.35);
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 45px rgba(45, 212, 191, 0.15);
  }
  .mockup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .mockup-title {
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #2dd4bf;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .stopwatch-badge {
    background: rgba(217, 119, 6, 0.25);
    border: 1px solid rgba(245, 158, 11, 0.5);
    color: #fbbf24;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 800;
  }
  .session-card {
    background: rgba(9, 18, 23, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 14px;
  }
  .session-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }
  .session-name {
    font-size: 16px;
    font-weight: 800;
    color: #ffffff;
  }
  .match-pill {
    background: #0d4d44;
    color: #5eead4;
    border: 1px solid #14b8a6;
    font-size: 12px;
    font-weight: 800;
    padding: 3px 9px;
    border-radius: 6px;
  }
  .host-row {
    font-size: 13px;
    color: #94a3b8;
    margin-bottom: 12px;
  }
  .location-tag {
    font-size: 12px;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 4px 10px;
    border-radius: 6px;
    margin-bottom: 14px;
    display: inline-block;
  }
  .explain-list {
    background: rgba(0, 0, 0, 0.35);
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 12px;
    color: #cbd5e1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
  }
  .explain-item {
    display: flex;
    justify-content: space-between;
  }
  .explain-item .pts {
    color: #2dd4bf;
    font-weight: 800;
  }
  .cta-button {
    width: 100%;
    background: linear-gradient(135deg, #0a635a 0%, #0e7f74 100%);
    border: 1px solid #2dd4bf;
    color: #ffffff;
    padding: 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 800;
    text-align: center;
  }
  .bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 10;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 20px;
    font-size: 13px;
    color: #64748b;
  }
  .metrics-row {
    display: flex;
    gap: 26px;
  }
  .metric {
    color: #cbd5e1;
    font-weight: 600;
  }
  .metric strong {
    color: #ffffff;
  }
</style>
</head>
<body>
  <div class="glow-1"></div>
  <div class="glow-2"></div>

  <div class="top-bar">
    <div class="brand-badge">
      <div class="dot"></div>
      UXDC DESIGNATHON 2026
    </div>
    <div class="track-badge">
      🏆 Experienced Track
    </div>
  </div>

  <div class="hero-grid">
    <div class="hero-left">
      <h1>CampusBuddy</h1>
      <div class="tagline">Your campus. Your people. <span>Your moments.</span></div>
      <div class="desc">
        A low-pressure, moment-based micro-connection platform for university students. Overcoming isolation by connecting study and lunch peers at safe campus landmarks in under 90 seconds.
      </div>
      <div class="pill-row">
        <div class="pill">⚡ 90s Micro-Sprint</div>
        <div class="pill">📍 Verified Landmarks</div>
        <div class="pill">🔒 Anti-Feed & Safe</div>
        <div class="pill">♿ WCAG 2.2 AA</div>
      </div>
    </div>

    <div class="mockup-card">
      <div class="mockup-header">
        <div class="mockup-title">⚡ 90-Second Micro-Connection</div>
        <div class="stopwatch-badge">⏱️ 00:14s elapsed</div>
      </div>

      <div class="session-card">
        <div class="session-top">
          <div class="session-name">Calculus Revision, Quiet Corner</div>
          <div class="match-pill">75% FIT</div>
        </div>
        <div class="host-row">
          Hosted by <strong>Dev</strong> (Commuter · CS)
        </div>
        <div class="location-tag">
          📍 Taylor Family Digital Library (TFDL), Level 2
        </div>

        <div class="explain-list">
          <div class="explain-item">
            <span>Study together activity</span>
            <span class="pts">+30 pts</span>
          </div>
          <div class="explain-item">
            <span>Free afternoon slot</span>
            <span class="pts">+25 pts</span>
          </div>
          <div class="explain-item">
            <span>Shared topic: Calculus</span>
            <span class="pts">+20 pts</span>
          </div>
        </div>

        <div class="cta-button">
          ✓ Connected in 14 Seconds
        </div>
      </div>
    </div>
  </div>

  <div class="bottom-bar">
    <div class="metrics-row">
      <div class="metric">🎯 <strong>Weak-Tie Theory</strong> Grounded</div>
      <div class="metric">🧪 <strong>35/35</strong> Automated Tests</div>
      <div class="metric">⚡ <strong>Zero-Build</strong> Web App</div>
    </div>
    <div>University of Calgary UI/UX Club · Devpost Submission</div>
  </div>
</body>
</html>`;

const rootDir = path.resolve(__dirname, '..');
const srcHtmlPath = path.join(rootDir, 'thumbnail_render.html');
const outPngPath = path.join(rootDir, 'thumbnail.png');

fs.writeFileSync(srcHtmlPath, htmlContent, 'utf-8');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-thumb-'));

console.log('Rendering thumbnail via Edge headless...');
const fileUrl = 'file:///' + srcHtmlPath.replace(/\\/g, '/');

const res = spawnSync(edgePath, [
  '--headless=new',
  `--user-data-dir=${tempDir}`,
  `--screenshot=${outPngPath}`,
  '--window-size=1200,800',
  '--hide-scrollbars',
  fileUrl
], { encoding: 'utf-8' });

if (res.error) {
  console.error('Edge spawn error:', res.error);
} else {
  console.log('Edge process exited with code:', res.status);
}

if (fs.existsSync(outPngPath)) {
  const stat = fs.statSync(outPngPath);
  console.log(`SUCCESS: Created ${outPngPath} (${stat.size} bytes)`);
} else {
  console.error('Failed to create thumbnail.png');
}

try {
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch (e) {}

