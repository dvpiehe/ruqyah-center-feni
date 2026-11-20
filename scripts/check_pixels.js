const sharp = require('sharp');
const fs = require('fs');

async function checkPixels() {
  const { data, info } = await sharp('scratch/font_test.png').raw().toBuffer({ resolveWithObject: true });
  
  // Check rows 75 to 110 (Bengali)
  let bnNonWhite = 0;
  for (let y = 75; y <= 110; y++) {
    for (let x = 40; x <= 600; x++) {
      const idx = (y * info.width + x) * info.channels;
      if (data[idx] < 240 || data[idx+1] < 240 || data[idx+2] < 240) {
        bnNonWhite++;
      }
    }
  }

  // Check rows 125 to 160 (English)
  let enNonWhite = 0;
  for (let y = 125; y <= 160; y++) {
    for (let x = 40; x <= 600; x++) {
      const idx = (y * info.width + x) * info.channels;
      if (data[idx] < 240 || data[idx+1] < 240 || data[idx+2] < 240) {
        enNonWhite++;
      }
    }
  }

  console.log('Bengali region non-white pixels:', bnNonWhite);
  console.log('English region non-white pixels:', enNonWhite);
}

checkPixels().catch(console.error);
