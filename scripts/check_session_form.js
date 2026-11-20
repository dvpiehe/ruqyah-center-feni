const fs = require('fs');
const content = fs.readFileSync('./public/js/admin.js', 'utf8');
const idx = content.indexOf("document.getElementById('newSessionForm')?.addEventListener('submit'");
console.log(content.substring(idx - 300, idx + 1800));
