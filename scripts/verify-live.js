import https from 'node:https';

const urls = [
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/campusbuddy.html',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/video_showcase.html',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/video.html',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/manifest.webmanifest',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/sw.js',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/health',
  'https://vikassharma270907-alt.github.io/campusbuddy-uxdc/campusbuddy_showcase.mp4'
];

async function checkUrl(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Node-Healthcheck' } }, res => {
      console.log(`[LIVE VERIFIED] ${res.statusCode} ${res.statusMessage} -> ${url}`);
      console.log(`  Content-Type: ${res.headers['content-type']}`);
      console.log(`  Content-Length: ${res.headers['content-length']} bytes`);
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    }).on('error', err => {
      console.error(`[ERROR] ${url} -> ${err.message}`);
      resolve(null);
    });
  });
}

async function run() {
  for (const u of urls) {
    await checkUrl(u);
  }
}

run();
