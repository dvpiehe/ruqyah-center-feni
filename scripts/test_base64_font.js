const sharp = require('sharp');
const fs = require('fs');

async function testBase64Font() {
  const fontBuf = fs.readFileSync('public/fonts/NotoSansBengali.ttf');
  const base64Font = fontBuf.toString('base64');

  const svg = `
  <svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        @font-face {
          font-family: 'Noto Sans Bengali';
          src: url('data:font/truetype;charset=utf-8;base64,${base64Font}') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        .bengali-text {
          font-family: 'Noto Sans Bengali', sans-serif;
          font-size: 28px;
          fill: #0F5132;
        }
      </style>
    </defs>
    <rect width="100%" height="100%" fill="#ffffff" />
    <text x="30" y="80" class="bengali-text">
      রুকইয়াহ সাপোর্ট এন্ড কাপিং সেন্টার — ফেনী শাখা
    </text>
    <text x="30" y="140" class="bengali-text">
      রোগীর পূর্ণাঙ্গ স্বাস্থ্য ও ডায়াগনোসিস বিবরণী
    </text>
  </svg>
  `;

  const pngBuf = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.writeFileSync('scratch/test_base64_noto.png', pngBuf);
  console.log('Saved scratch/test_base64_noto.png, size:', pngBuf.length);
}

testBase64Font().catch(console.error);
