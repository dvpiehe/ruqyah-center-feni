const sharp = require('sharp');
const fs = require('fs');
const db = require('../database/db');
const pdfGen = require('../utils/pdfGenerator');

async function check() {
  const p = db.prepare('SELECT * FROM patients WHERE patient_id = ?').get('RSCC-P-1098');
  const h = db.prepare('SELECT * FROM patient_histories WHERE patient_id = ?').get('RSCC-P-1098');
  const d = db.prepare('SELECT * FROM patient_diagnoses WHERE patient_id = ?').get('RSCC-P-1098');

  // Let's inspect what sharp renders for an SVG containing Bengali
  const svg = `
  <svg width="1240" height="1754" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#ffffff" />
    <text x="50" y="100" font-family="Noto Sans Bengali, Nirmala UI, sans-serif" font-size="28" fill="#0F5132">
      রুকইয়াহ সাপোর্ট এন্ড কাপিং সেন্টার
    </text>
    <text x="50" y="150" font-family="sans-serif" font-size="28" fill="#000000">
      RUQYAH SUPPORT &amp; CUPPING CENTER
    </text>
  </svg>
  `;

  const imgBuf = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.writeFileSync('scratch/font_test.png', imgBuf);
  console.log('Saved scratch/font_test.png');
}

check().catch(console.error);
