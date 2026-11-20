const sharp = require('sharp');
const fs = require('fs');

async function check() {
  const svg = `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#FFFFFF"/>
    <text x="20" y="50" font-family="'Nirmala UI', sans-serif" font-size="24" fill="#0F5132">রুকইয়াহ সাপোর্ট অ্যান্ড হিজামা সেন্টার — ফেনী শাখা</text>
    <text x="20" y="100" font-family="'Nirmala UI', sans-serif" font-size="20" fill="#1E293B">পরিচালক ও প্রধান রাক্বী: মুহাম্মদুল্লাহ মিয়াহ (যুক্তাক্ষর: ক্ত, ঙ্গ, ক্ষ, ষ্ণ, ষ্ঠ, র্জ)</text>
    <text x="20" y="150" font-family="'Nirmala UI', sans-serif" font-size="20" fill="#DC2626">জরুরি সতর্কতা: আত্মহত্যার প্রবণতা বা মানসিক স্বাস্থ্য সমস্যা</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile('test_bengali_render.png');
  console.log('PNG rendered successfully');
}
check().catch(console.error);
