const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
console.log('Includes data-a="theme":', html.includes('data-a="theme"'));
const match = html.match(/<button[^>]*theme[^>]*>/i);
console.log('Theme button match:', match ? match[0] : 'None');
