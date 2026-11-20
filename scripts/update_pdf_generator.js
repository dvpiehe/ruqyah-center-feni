const fs = require('fs');

const path = './utils/pdfGenerator.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Add diagnosis and reaction mappings to CLINICAL_TRANSLATIONS
const diagMappings = `
  // 11 Manual Diagnosis Options
  'আইন (Ayn)': 'Ayn (Evil Eye)',
  'Ayn (Evil Eye)': 'আইন (Ayn)',
  'হাসাদ (Hasad)': 'Hasad (Envy / Malice)',
  'Hasad (Envy / Malice)': 'হাসাদ (Hasad)',
  'সেহের (Sihr)': 'Sihr (Magic / Sorcery)',
  'Sihr (Magic / Sorcery)': 'সেহের (Sihr)',
  'জ্বিনের প্রভাব (Jinn Influence)': 'Jinn Influence (Possession / Touch)',
  'Jinn Influence (Possession / Touch)': 'জ্বিনের প্রভাব (Jinn Influence)',
  'আইন + হাসাদ': 'Ayn + Hasad',
  'Ayn + Hasad': 'আইন + হাসাদ',
  'আইন + সেহের': 'Ayn + Sihr',
  'Ayn + Sihr': 'আইন + সেহের',
  'হাসাদ + সেহের': 'Hasad + Sihr',
  'Hasad + Sihr': 'হাসাদ + সেহের',
  'জ্বিন + সেহের': 'Jinn + Sihr',
  'Jinn + Sihr': 'জ্বিন + সেহের',
  'একাধিক সমস্যা (Multiple)': 'Multiple Afflictions',
  'Multiple Afflictions': 'একাধিক সমস্যা (Multiple)',
  'নরমাল / নির্দিষ্ট কোনো লক্ষণ শনাক্ত হয়নি (Normal)': 'Normal / No Specific Symptoms Detected',
  'Normal / No Specific Symptoms Detected': 'নরমাল / নির্দিষ্ট কোনো লক্ষণ শনাক্ত হয়নি (Normal)',
  'অন্যান্য (Other)': 'Other',
  'Other': 'অন্যান্য (Other)',

  // Session Reactions
  'Trembling / involuntary shivering in limbs': 'অঙ্গপ্রত্যঙ্গে কাঁপুনি বা কম্পন',
  'Deep repeated yawning': 'বারবার গভীর হাই তোলা',
  'Profuse cold sweating': 'শরীর ঠান্ডা হয়ে ঘাম বের হওয়া',
  'Sudden weeping / tears without grief': 'অকারণে হঠাৎ কান্না বা অশ্রুপাত',
  'Nausea / urge to vomit': 'বমি বমি ভাব বা বমির তীব্র বেগ',
  'Vocal alteration / involuntary speech': 'কণ্ঠস্বরের পরিবর্তন বা অনৈচ্ছিক কথা',
  'Rapid heart palpitations': 'হৃদস্পন্দন দ্রুত হওয়া বা ধড়ফড়',
  'Temporary numbness or paralysis in hands/feet': 'হাত-পায়ে অবশ ভাব বা অসাড়তা',
  'Calmness / no adverse physical reaction': 'স্বাভাবিক বা কোনো অস্বাভাবিক প্রতিক্রিয়া নেই',
`;

if (!content.includes("'আইন (Ayn)': 'Ayn (Evil Eye)'")) {
  content = content.replace('const CLINICAL_TRANSLATIONS = {', 'const CLINICAL_TRANSLATIONS = {' + diagMappings);
}

// 2. Update resolvePatientSymptoms to support Category 1 main_complaints_text
const cat1Support = `
    // Check Category 1: Patient's Main Symptoms text
    if (diagnosis.main_complaints_text && diagnosis.main_complaints_text.trim()) {
      try {
        const cat1 = db.prepare("SELECT * FROM diagnosis_categories WHERE code = 'patient_main_symptoms'").get();
        if (cat1 && !categoriesMap.has(cat1.id)) {
          categoriesMap.set(cat1.id, {
            category_id: cat1.id,
            category_code: cat1.code,
            name_bn: cat1.name_bn,
            name_en: cat1.name_en,
            sort_order: cat1.sort_order,
            symptoms: [{
              id: null,
              name_bn: diagnosis.main_complaints_text.trim(),
              name_en: translateClinicalItem(diagnosis.main_complaints_text.trim(), 'en')
            }]
          });
        }
      } catch (e) {}
    }
`;

if (!content.includes('patient_main_symptoms') && content.includes('// 1. Process from diagnosis if exists')) {
  content = content.replace('// 1. Process from diagnosis if exists', '// 1. Process from diagnosis if exists\n' + cat1Support);
}

// 3. Replace generateRuqyahSessionPdf with the new 6-section implementation
const sessionFuncStart = content.indexOf('async function generateRuqyahSessionPdf(');
const sessionFuncEnd = content.indexOf('module.exports = {', sessionFuncStart);

if (sessionFuncStart === -1 || sessionFuncEnd === -1) {
  console.error('Could not locate generateRuqyahSessionPdf in utils/pdfGenerator.js', { sessionFuncStart, sessionFuncEnd });
  process.exit(1);
}

const newSessionFunc = `async function generateRuqyahSessionPdf(session, patient, lang = 'bn') {
  const isBn = lang === 'bn';
  const width = 1240;
  const height = 1754;
  const logoBase64 = getLogoBase64();
  const notoFontBase64 = getNotoBengaliBase64();

  const t = {
    clinicName: isBn ? 'রুকইয়াহ সাপোর্ট এন্ড কাপিং সেন্টার' : 'RUQYAH SUPPORT & CUPPING CENTER',
    clinicSub: isBn ? 'ফেনী শাখা  |  ভূঁইয়া ম্যানশন, আদর্শ হাউজিং সোসাইটি, মহিপাল, ফেনী' : 'FENI BRANCH  |  Bhuya Mansion, Adarsha Housing Society, Mohipal, Feni',
    phoneRaqi: isBn ? 'হটলাইন / হোয়াটসঅ্যাপ: ০১৭৫৮-৩৫৪৯২০  |  পরিচালক ও প্রধান রাকি: মুহাম্মদুল্লাহ মিয়া' : 'Hotline / WhatsApp: 01758-354920  |  Lead Raqi: Muhammadullah Miah',
    reportTitle: isBn ? 'রুকইয়াহ শারঈয়্যাহ সেশন প্রেসক্রিপশন রিপোর্ট' : 'RUQYAH SESSION CLINICAL REPORT',
    ref: isBn ? \`সেশন আইডি: \${session.session_id}\` : \`Session Ref: \${session.session_id}\`,
    date: isBn ? \`তারিখ: \${toBengaliDigits(session.session_date)}\` : \`Date: \${session.session_date}\`,
    sessionHeader: isBn ? \`রুকইয়াহ সেশন #\${toBengaliDigits(session.session_number)} বিবরণ\` : \`SESSION #\${session.session_number} DETAILS\`,
    pName: isBn ? 'রোগীর নাম' : 'Patient Name',
    pAgeGender: isBn ? 'বয়স / লিঙ্গ' : 'Age / Gender',
    status: isBn ? 'সেশন স্ট্যাটাস' : 'Session Status',
    nextFollowup: isBn ? 'পরবর্তী ফলোআপ তারিখ' : 'Next Followup Date',
    sec1: isBn ? '১. রোগীর প্রধান উপসর্গসমূহ' : '1. PATIENT\\'S MAIN SYMPTOMS',
    sec2: isBn ? '২. তেলাওয়াত চলাকালীন রোগীর শারীরিক অবস্থা' : '2. PATIENT\\'S PHYSICAL CONDITION DURING RECITATION',
    sec3: isBn ? '৩. রাকীর প্রাথমিক ডায়াগনোসিস' : '3. RAQI\\'S PRELIMINARY DIAGNOSIS',
    sec4: isBn ? '৪. প্রেসক্রাইবকৃত আমল' : '4. PRESCRIBED AMAL',
    sec5: isBn ? '৫. রাকীর মন্তব্য' : '5. RAQI\\'S COMMENTS',
    sec6: isBn ? '৬. বিশেষ নসিহত' : '6. SPECIAL ADVICE',
    shifaNotice: isBn
      ? 'শিফা ও পূর্ণ সুস্থতা কেবল মহান আল্লাহর পক্ষ থেকে। রুকইয়াহ শারঈয়্যাহ হলো কুরআন ও সুন্নাহ সম্মত চিকিৎসা পদ্ধতি।'
      : 'Healing (Shifa) belongs solely to Allah. Ruqyah is an authentic prophetic means rooted in the Qur\\'an and Sunnah.',
    raqiSign: isBn ? 'মুহাম্মদুল্লাহ মিয়া' : 'Muhammadullah Miah',
    raqiTitle: isBn ? 'কনসালট্যান্ট রাকি ও সুন্নাহ প্র্যাকটিশনার' : 'Consultant Raqi & Sunnah Practitioner'
  };

  let svgContent = \`
  <svg width="\${width}" height="\${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        \${notoFontBase64 ? \`
        @font-face {
          font-family: 'Noto Sans Bengali';
          src: url('data:font/truetype;charset=utf-8;base64,\${notoFontBase64}') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        \` : ''}
        @font-face {
          font-family: 'Noto Sans Bengali';
          src: local('Noto Sans Bengali'), local('Nirmala UI'), local('Vrinda'), local('SolaimanLipi'), local('Arial Unicode MS');
        }
        .font-base {
          font-family: 'Noto Sans Bengali', 'Nirmala UI', 'Vrinda', 'SolaimanLipi', 'Segoe UI', Arial, sans-serif;
        }
      </style>
    </defs>
    <rect width="100%" height="100%" fill="#FFFFFF" />
    
    <!-- Top Green Accent Bar -->
    <rect x="50" y="40" width="\${width - 100}" height="10" fill="#0F5132" rx="3" />
    
    <!-- Header: Logo + Clinic Info -->
    <g transform="translate(50, 65)">
      \${logoBase64 ? \`<image href="\${logoBase64}" x="0" y="0" width="90" height="90" />\` : ''}
      <g transform="translate(\${logoBase64 ? '105' : '0'}, 25)">
        <text class="font-base" font-size="26" font-weight="bold" fill="#0F5132">\${escapeXml(t.clinicName)}</text>
        <text class="font-base" font-size="14" fill="#4B5563" y="26">\${escapeXml(t.clinicSub)}</text>
        <text class="font-base" font-size="13" fill="#059669" font-weight="600" y="48">\${escapeXml(t.phoneRaqi)}</text>
      </g>
    </g>

    <!-- Badge Header Right -->
    <g transform="translate(840, 65)">
      <rect width="350" height="90" rx="8" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1.5" />
      <text class="font-base" x="20" y="32" font-size="14" font-weight="bold" fill="#065F46">\${escapeXml(t.reportTitle)}</text>
      <text class="font-base" x="20" y="56" font-size="13" fill="#1E293B">\${escapeXml(t.ref)}</text>
      <text class="font-base" x="20" y="76" font-size="12" fill="#64748B">\${escapeXml(t.date)}</text>
    </g>

    <!-- Divider Line -->
    <line x1="50" y1="170" x2="\${width - 50}" y2="170" stroke="#CBD5E1" stroke-width="1.5" />

    <!-- Session Meta Box -->
    <g transform="translate(50, 185)">
      <rect width="\${width - 100}" height="105" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
      
      <rect x="0" y="0" width="\${width - 100}" height="30" rx="8" fill="#F1F5F9" />
      <text class="font-base" x="20" y="20" font-size="13" font-weight="bold" fill="#0F5132">\${escapeXml(t.sessionHeader)}</text>
      
      <!-- Row 1 -->
      <text class="font-base" x="20" y="55" font-size="12.5" fill="#64748B">\${escapeXml(t.pName)}: <tspan font-weight="bold" fill="#0F172A">\${escapeXml(patient.full_name)} (\${escapeXml(patient.patient_id)})</tspan></text>
      <text class="font-base" x="480" y="55" font-size="12.5" fill="#64748B">\${escapeXml(t.pAgeGender)}: <tspan font-weight="bold" fill="#0F172A">\${isBn ? toBengaliDigits(patient.age) + ' বছর' : patient.age + ' Yrs'} / \${escapeXml(translateClinicalItem(patient.gender, isBn ? 'bn' : 'en'))}</tspan></text>
      <text class="font-base" x="800" y="55" font-size="12.5" fill="#64748B">\${isBn ? 'সেশন তারিখ' : 'Date'}: <tspan font-weight="bold" fill="#064E3B">\${isBn ? toBengaliDigits(session.session_date) : session.session_date}</tspan></text>
      
      <!-- Row 2 -->
      <text class="font-base" x="20" y="85" font-size="12.5" fill="#64748B">\${isBn ? 'পরিচালক রাকি' : 'Conducting Raqi'}: <tspan font-weight="600" fill="#0F172A">\${isBn ? 'মুহাম্মদুল্লাহ মিয়া' : (session.raqi_name || 'Muhammadullah Miah')}</tspan></text>
      <text class="font-base" x="480" y="85" font-size="12.5" fill="#64748B">\${escapeXml(t.status)}: <tspan font-weight="600" fill="#059669">\${escapeXml(translateClinicalItem(session.status, isBn ? 'bn' : 'en'))}</tspan></text>
      <text class="font-base" x="800" y="85" font-size="12.5" fill="#64748B">\${escapeXml(t.nextFollowup)}: <tspan font-weight="bold" fill="#D97706">\${escapeXml(session.next_followup_date ? (isBn ? toBengaliDigits(session.next_followup_date) : session.next_followup_date) : (isBn ? 'নির্ধারিত হবে' : 'Pending'))}</tspan></text>
    </g>
  \`;

  let currentY = 310;

  function renderSessionBox(title, items, isHighlight = false) {
    const parsedLines = [];
    for (const item of items) {
      const fullText = item.value || '';
      const wrapped = wrapText(fullText, 88);
      parsedLines.push({ label: item.label, lines: wrapped });
    }
    const totalLinesCount = parsedLines.reduce((acc, p) => acc + Math.max(p.lines.length, 1), 0);
    const boxHeight = 28 + (totalLinesCount * 20) + (items.length * 4);

    svgContent += \`
      <g transform="translate(50, \${currentY})">
        <rect width="\${width - 100}" height="\${boxHeight}" rx="6" fill="\${isHighlight ? '#FAFDFB' : '#FFFFFF'}" stroke="\${isHighlight ? '#059669' : '#E2E8F0'}" stroke-width="1.2" />
        <rect x="0" y="0" width="\${width - 100}" height="26" rx="6" fill="\${isHighlight ? '#ECFDF5' : '#F8FAFC'}" />
        <rect x="0" y="0" width="4" height="26" fill="#059669" />
        <text class="font-base" x="16" y="18" font-size="12.5" font-weight="bold" fill="\${isHighlight ? '#065F46' : '#0F5132'}">\${escapeXml(title)}</text>
    \`;
    let lineY = 46;
    for (const p of parsedLines) {
      if (p.lines.length === 0) {
        svgContent += \`
          <text class="font-base" x="20" y="\${lineY}" font-size="11.5" fill="#334155">
            <tspan font-weight="600" fill="#0F172A">\${escapeXml(p.label)}:</tspan> -
          </text>
        \`;
        lineY += 22;
      } else {
        svgContent += \`
          <text class="font-base" x="20" y="\${lineY}" font-size="11.5" fill="#334155">
            <tspan font-weight="600" fill="#0F172A">\${escapeXml(p.label)}:</tspan> \${escapeXml(p.lines[0])}
          </text>
        \`;
        lineY += 20;
        for (let i = 1; i < p.lines.length; i++) {
          svgContent += \`
            <text class="font-base" x="35" y="\${lineY}" font-size="11" fill="#475569">\${escapeXml(p.lines[i])}</text>
          \`;
          lineY += 19;
        }
        lineY += 4;
      }
    }
    svgContent += \`</g>\`;
    currentY += boxHeight + 14;
  }

  // SECTION 1: Patient's Main Symptoms
  const mainSymptomsText = session.patient_main_symptoms || session.reported_symptoms || session.initial_assessment || (isBn ? 'কোনো প্রধান উপসর্গ লিপিবদ্ধ করা হয়নি।' : 'No chief complaints recorded.');
  renderSessionBox(t.sec1, [
    { label: isBn ? 'প্রধান উপসর্গ বিবরণ' : 'Reported Symptoms', value: translateClinicalItem(mainSymptomsText, isBn ? 'bn' : 'en') }
  ]);

  // SECTION 2: Patient's Physical Condition During Recitation
  const reactionsList = parseList(session.observed_reactions);
  const formattedReactions = reactionsList.length > 0 
    ? reactionsList.map(r => translateClinicalItem(r, isBn ? 'bn' : 'en')).join(', ') 
    : (isBn ? 'তিলাওয়াতকালে কোনো অস্বাভাবিক শারীরিক প্রতিক্রিয়া দেখা যায়নি।' : 'No abnormal physical reaction observed.');
  const physObsText = session.physical_observations || session.raqi_observations || '';
  const sec2Items = [
    { label: isBn ? 'পর্যবেক্ষণকৃত শারীরিক প্রতিক্রিয়া' : 'Observed Physical Reactions', value: formattedReactions }
  ];
  if (physObsText && physObsText.trim()) {
    sec2Items.push({
      label: isBn ? 'অতিরিক্ত শারীরিক পর্যবেক্ষণ' : 'Additional Observations',
      value: translateClinicalItem(physObsText, isBn ? 'bn' : 'en')
    });
  }
  renderSessionBox(t.sec2, sec2Items);

  // SECTION 3: Raqi's Preliminary Diagnosis (Highlighted)
  let diagList = parseList(session.manual_diagnosis);
  if (diagList.length === 0 && session.assessment_category) {
    diagList = session.assessment_category.split(',').map(d => d.trim()).filter(Boolean);
  }
  const formattedDiagnosis = diagList.length > 0
    ? diagList.map(d => translateClinicalItem(d, isBn ? 'bn' : 'en')).join(', ')
    : (isBn ? 'ক্লিনিক্যাল পর্যবেক্ষণে রয়েছে' : 'Under Clinical Evaluation');
  renderSessionBox(t.sec3, [
    { label: isBn ? 'শারঈ ডায়াগনোসিস' : 'Diagnostic Classification', value: formattedDiagnosis }
  ], true);

  // SECTION 4: Prescribed Amal
  const amalText = session.prescribed_amal || (typeof session.prescribed_remedies === 'string' && !session.prescribed_remedies.startsWith('[') ? session.prescribed_remedies : '') || (isBn ? 'নির্দিষ্ট কোনো আমল প্রেসক্রাইব করা হয়নি।' : 'No prescribed amal recorded.');
  renderSessionBox(t.sec4, [
    { label: isBn ? 'প্রেসক্রাইবকৃত আমল' : 'Prescribed Amal', value: translateClinicalItem(amalText, isBn ? 'bn' : 'en') }
  ]);

  // SECTION 5: Raqi's Comments
  const commentsText = session.raqi_comments || session.professional_assessment || (isBn ? 'কোনো অতিরিক্ত মন্তব্য নেই।' : 'No additional comments recorded.');
  renderSessionBox(t.sec5, [
    { label: isBn ? 'রাকীর মন্তব্য ও পর্যবেক্ষণ' : 'Raqi\\'s Clinical Comments', value: translateClinicalItem(commentsText, isBn ? 'bn' : 'en') }
  ]);

  // SECTION 6: Special Advice
  const adviceText = session.special_advice || session.recommendations || (isBn ? 'পাঁচ ওয়াক্ত সালাত জামাতের সাথে আদায় ও নিয়মিত সকাল-সন্ধ্যার জিকির পালন।' : 'Maintain congregational prayers and regular morning and evening Adhkar.');
  renderSessionBox(t.sec6, [
    { label: isBn ? 'বিশেষ নসিহত ও দিকনির্দেশনা' : 'Special Advice & Guidance', value: translateClinicalItem(adviceText, isBn ? 'bn' : 'en') }
  ]);

  // Dynamic Footer Positioning
  const footerY = Math.max(currentY + 20, 1560);
  svgContent += \`
    <g transform="translate(50, \${footerY})">
      <line x1="0" y1="0" x2="\${width - 100}" y2="0" stroke="#CBD5E1" stroke-width="1.5" />
      
      <g transform="translate(540, 15)">
        <rect width="240" height="90" rx="4" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4" />
        <text class="font-base" x="120" y="50" font-size="12" fill="#94A3B8" text-anchor="middle">\${isBn ? '[ অফিসিয়াল সিল ]' : '[ CLINIC OFFICIAL SEAL ]'}</text>
      </g>

      <g transform="translate(850, 15)">
        <text class="font-base" x="160" y="32" font-size="20" font-style="italic" fill="#0F5132" text-anchor="middle">\${escapeXml(t.raqiSign)}</text>
        <line x1="40" y1="42" x2="280" y2="42" stroke="#0F5132" stroke-width="1.5" />
        <text class="font-base" x="160" y="60" font-size="13" font-weight="bold" fill="#0F172A" text-anchor="middle">\${escapeXml(t.raqiSign)}</text>
        <text class="font-base" x="160" y="78" font-size="11.5" fill="#64748B" text-anchor="middle">\${escapeXml(t.raqiTitle)}</text>
      </g>

      <text class="font-base" x="\${(width - 100) / 2}" y="125" font-size="11.5" fill="#94A3B8" text-anchor="middle">\${escapeXml(t.shifaNotice)}</text>
    </g>
  </svg>
  \`;

  const totalHeight = Math.max(height, footerY + 160);
  if (totalHeight > height) {
    svgContent = svgContent.replace(\`height="\${height}"\`, \`height="\${totalHeight}"\`);
  }

  const pngBuf = await renderSvgToPng(svgContent);
  const jpegBuf = await sharp(pngBuf).jpeg({ quality: 95 }).toBuffer();
  const textEntries = isBn ? [] : [
    'RUQYAH SUPPORT & CUPPING CENTER',
    'RUQYAH SESSION CLINICAL REPORT',
    \`Session ID: \${session.session_id}\`,
    \`Patient: \${patient.full_name} (\${patient.patient_id})\`,
    \`Classification: \${session.assessment_category || ''}\`,
    session.professional_assessment || ''
  ];
  return packJpegToPdf(jpegBuf, width, totalHeight, textEntries);
}

`;

content = content.substring(0, sessionFuncStart) + newSessionFunc + content.substring(sessionFuncEnd);
fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated pdfGenerator.js');
