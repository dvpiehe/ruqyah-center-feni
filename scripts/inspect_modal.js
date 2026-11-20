const fs = require('fs');
const content = fs.readFileSync('./views/admin.html', 'utf8');
const start = content.indexOf('id="newSessionModal"');
const end = content.indexOf('MODAL 7: FOLLOW-UP', start);
console.log(content.substring(start - 10, end - 10));
