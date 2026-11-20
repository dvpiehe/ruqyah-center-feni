const fs = require('fs');
const path = require('path');

const pngPath = path.join(__dirname, '..', 'public', 'images', 'logo.png');
const pngBuf = fs.readFileSync(pngPath);
const base64Png = 'data:image/png;base64,' + pngBuf.toString('base64');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 80" fill="none">
  <!-- Official Clinic Logo: RUKAYAH Support & Cupping Center -->
  <image href="${base64Png}" x="0" y="0" width="75" height="80" preserveAspectRatio="xMidYMid meet" />
  <g transform="translate(85, 20)">
    <text x="0" y="18" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="16" fill="#064E3B" letter-spacing="-0.3">RUQYAH SUPPORT</text>
    <text x="0" y="34" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="12" fill="#0F5132">&amp; CUPPING CENTER</text>
    <text x="0" y="47" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="9" fill="#B45309" letter-spacing="1">FENI BRANCH</text>
  </g>
</svg>`;

const svgPath = path.join(__dirname, '..', 'public', 'images', 'logo.svg');
fs.writeFileSync(svgPath, svg);
console.log('Successfully updated logo.svg');
