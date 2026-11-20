const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, '..', 'views');

const footerFiles = [
  'about.html',
  'book.html',
  'contact.html',
  'index.html',
  'lookup.html',
  'policies.html',
  'services.html'
];

const targetPattern = /<img\s+src="\/images\/logo\.svg"\s+alt="Ruqyah Support & Cupping Center"\s+style="height:\s*48px;\s*filter:\s*brightness\(0\)\s*invert\(1\);"[^>]*>/g;

const replacement = `<div style="display: inline-flex; align-items: center; background: #ffffff; padding: 6px 14px; border-radius: 10px; margin-bottom: 1rem; box-shadow: 0 3px 10px rgba(0,0,0,0.15);">
            <img src="/images/logo.png" alt="Ruqyah Support & Cupping Center" style="height: 44px; width: auto; object-fit: contain;">
          </div>`;

for (const file of footerFiles) {
  const filePath = path.join(viewsDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (targetPattern.test(content)) {
      content = content.replace(targetPattern, replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated footer logo in ${file}`);
    } else {
      console.log(`Pattern not found in ${file}`);
    }
  }
}

// Update admin.html sidebar brand
const adminPath = path.join(viewsDir, 'admin.html');
let adminContent = fs.readFileSync(adminPath, 'utf8');
const adminTarget = /<img\s+src="\/images\/logo\.svg"\s+alt="Ruqyah Center"\s+style="height:\s*38px;\s*filter:\s*brightness\(0\)\s*invert\(1\);"[^>]*>/;
if (adminTarget.test(adminContent)) {
  adminContent = adminContent.replace(adminTarget, `<img src="/images/logo.png" alt="Ruqyah Center" style="height: 38px; width: auto; object-fit: contain; background: #ffffff; padding: 3px 6px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">`);
  fs.writeFileSync(adminPath, adminContent, 'utf8');
  console.log('Updated admin sidebar logo in admin.html');
}
