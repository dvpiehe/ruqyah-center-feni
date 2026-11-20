const sharp = require('sharp');
const fs = require('fs');

async function test() {
  const svg = `<svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="white"/>
    <text x="20" y="50" font-family="Noto Sans Bengali, Nirmala UI, sans-serif" font-size="24" fill="black">
      রুকইয়াহ সাপোর্ট এন্ড কাপিং সেন্টার
    </text>
  </svg>`;

  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.mkdirSync('scratch', { recursive: true });
  fs.writeFileSync('scratch/test_bengali_render.png', buf);
  console.log('Saved test_bengali_render.png, size:', buf.length);
  
  // Let's check non-white pixels
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  let nonWhite = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i] < 250 || data[i+1] < 250 || data[i+2] < 250) {
      nonWhite++;
    }
  }
  console.log('Non-white pixels (glyph render check):', nonWhite);
}
test().catch(console.error);
