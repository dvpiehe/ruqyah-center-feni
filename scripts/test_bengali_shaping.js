const fs = require('fs');
const sharp = require('sharp');

async function testShaping() {
  const fontBuf = fs.readFileSync('public/fonts/NotoSansBengali.ttf');
  const b64 = fontBuf.toString('base64');

  const testCases = [
    'যুক্তাক্ষর পরীক্ষা: রক্ত, বঙ্গ, লক্ষণ, উষ্ণ, শ্রেষ্ঠ, বর্জন, শান্ত, খণ্ড, সম্পূর্ণ, দ্বীন, শব্দ, চিহ্ন, ভ্রমণ, পার্থক্য',
    'কার ও ফলা পরীক্ষা: কি, কী, কু, কূ, কৃ, কে, কৈ, কো, কৌ, ব্যাকরণ, তীব্র, বিশ্ব, স্মৃতি, অম্ল, কার্য, দুঃখ',
    'রুকইয়াহ ও প্রেসক্রিপশন: রুকইয়াহ ডায়াগনোসিস, কনসালটেন্ট ফি এবং প্রাথমিক ট্রিটমেন্টসহ: ২,০৫০ টাকা',
    'প্রধান সমস্যা ও উপসর্গ: তীব্র বা দীর্ঘস্থায়ী মাথাব্যথা, অকারণে ভয় বা আতঙ্ক, বোবায় ধরা / স্লিপ প্যারালাইসিস (কাবূস)',
    'চিকিৎসক ও প্রতিষ্ঠান: রুকইয়াহ সাপোর্ট এন্ড কাপিং সেন্টার — পরিচালক ও প্রধান রাকি: মুহাম্মদুল্লাহ মিয়াহ'
  ];

  let textTags = testCases.map((t, idx) => 
    `<text x="30" y="${60 + idx * 55}" font-family="Noto Sans Bengali" font-size="24" fill="#0F5132">${t}</text>`
  ).join('\n');

  const svg = `
  <svg width="1200" height="360" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        @font-face {
          font-family: "Noto Sans Bengali";
          src: url("data:font/truetype;charset=utf-8;base64,${b64}") format("truetype");
        }
      </style>
    </defs>
    <rect width="100%" height="100%" fill="#ffffff"/>
    ${textTags}
  </svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile('scratch/test_all_bengali_shaping.png');
  console.log('Saved scratch/test_all_bengali_shaping.png');
}

testShaping().catch(console.error);
