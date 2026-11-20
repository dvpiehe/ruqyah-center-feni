const fs = require('fs');
const path = require('path');

const adminHtml = fs.readFileSync(path.join(__dirname, '../views/admin.html'), 'utf8');

const modalMatches = [...adminHtml.matchAll(/id="([a-zA-Z0-9]+Modal)"/g)].map(m => m[1]);
console.log('Modals found:', modalMatches);

const tabMatches = [...adminHtml.matchAll(/id="tab-([a-zA-Z0-9_-]+)"/g)].map(m => m[1]);
console.log('Tabs found:', tabMatches);
