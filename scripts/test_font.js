const sharp = require('sharp');
const fs = require('fs');

async function testFont() {
  const text = 'রুকইয়াহ সাপোর্ট অ্যান্ড হিজামা সেন্টার — ফেনী শাখা। রোগীর পূর্ণাঙ্গ স্বাস্থ্য বিবরণী ও ৯টি ক্যাটাগরির বিস্তারিত ডায়াগনোসিস (পরীক্ষা: স্পর্শ, লক্ষণ, সিহর, স্মৃতিভ্রম, কষ্ট)।';
  
  const makeSvg = (font) => `<svg width="1200" height="120" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#FFFFFF" />
    <text x="20" y="60" font-family="${font}" font-size="20" fill="#0F5132">${text}</text>
  </svg>`;

  const fonts = [
    "'Noto Sans Bengali', 'Nirmala UI', sans-serif",
    "'Nirmala UI', Arial, sans-serif",
    "Arial, sans-serif",
    "sans-serif"
  ];

  for (const f of fonts) {
    const buf = await sharp(Buffer.from(makeSvg(f))).png().toBuffer();
    console.log('Font:', f, 'PNG size:', buf.length);
  }
}

testFont().catch(console.error);
