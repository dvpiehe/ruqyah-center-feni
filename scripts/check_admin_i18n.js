const fs = require('fs');
const path = require('path');

const adminHtml = fs.readFileSync(path.join(__dirname, '../views/admin.html'), 'utf8');

const i18nMatches = [...adminHtml.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]);
console.log('Total data-i18n tags in admin.html:', i18nMatches.length);
console.log('Sample tags:', i18nMatches.slice(0, 20));
