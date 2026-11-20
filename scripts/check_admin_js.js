const fs = require('fs');
const path = require('path');

const adminJs = fs.readFileSync(path.join(__dirname, '../public/js/admin.js'), 'utf8');

const statusOccurrences = [...adminJs.matchAll(/getBadgeClassForStatus\(([^)]+)\)/g)].length;
console.log('getBadgeClassForStatus calls:', statusOccurrences);

// Check function names in admin.js
const fnMatches = [...adminJs.matchAll(/async function ([a-zA-Z0-9_]+)\s*\(/g)].map(m => m[1]);
console.log('Async functions in admin.js:', fnMatches);
