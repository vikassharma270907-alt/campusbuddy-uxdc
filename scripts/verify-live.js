import https from 'node:https';

const urls = [
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/campusbuddy.html',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/video_showcase.html',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/video.html',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/manifest.webmanifest',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/sw.js',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/calendar.ics',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/health.json',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/api/spots.json',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/api/wellbeing.json',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/api/health.json',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/campusbuddy_showcase.mp4'
];

async function checkUrl(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const resCode = await new Promise(resolve => {
      const req = https.get(url, { headers: { 'User-Agent': 'Node-Healthcheck' } }, res => {
        console.log(`[LIVE VERIFIED] ${res.statusCode} ${res.statusMessage} -> ${url}`);
        console.log(`  Content-Type: ${res.headers['content-type']}`);
        console.log(`  Content-Length: ${res.headers['content-length']} bytes`);
        req.destroy();
        resolve(res.statusCode);
      });
      req.on('error', err => {
        if (attempt < retries) {
          console.log(`[RETRYING] ${url} after error: ${err.message}`);
          setTimeout(() => resolve(null), 500);
        } else {
          console.error(`[ERROR] ${url} -> ${err.message}`);
          resolve(null);
        }
      });
    });
    if (resCode !== null) return resCode;
  }
  return null;
}

async function run() {
  let failed = 0;
  for (const u of urls) {
    const code = await checkUrl(u);
    if (code !== 200 && code !== 206) failed++;
    await new Promise(r => setTimeout(r, 200));
  }
  if (failed > 0) {
    console.error(`\nProbe failed for ${failed} endpoints.`);
    process.exit(1);
  } else {
    console.log(`\nALL ${urls.length} LIVE ENDPOINTS VERIFIED 200 OK!`);
  }
}

run();
