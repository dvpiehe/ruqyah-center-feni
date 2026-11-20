const fs = require('fs');

const path = './public/js/admin.js';
let content = fs.readFileSync(path, 'utf8');

// Check newSessionForm
const formSubmitStart = content.indexOf("document.getElementById('newSessionForm')?.addEventListener('submit'");
console.log('formSubmitStart:', formSubmitStart);

const targetCategoryLoop = content.indexOf("${categories.map((cat, catIdx) => {");
console.log('targetCategoryLoop:', targetCategoryLoop);
