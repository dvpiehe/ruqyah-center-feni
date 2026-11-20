const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const db = require('../database/db');

// Read font
const fontPath = path.join(__dirname, '../public/fonts/NotoSansBengali.ttf');
const fontBase64 = fs.existsSync(fontPath) ? fs.readFileSync(fontPath).toString('base64') : '';

const CLINICAL_TRANSLATIONS = {
  'Severe or persistent headache': 'তীব্র বা দীর্ঘস্থায়ী মাথাব্যথা',
  'Dizziness or loss of balance': 'মাথা ঘোরা বা ভারসাম্যহীনতা',
  'Unusual restlessness': 'অস্বাভাবিক অস্থিরতা',
  'Reluctance to stay at home': 'ঘরে থাকতে অনীহা',
  'Unexplained fear or panic': 'অকারণে ভয় বা আতঙ্ক',
  'Difficulty concentrating on daily activities': 'দৈনন্দিন কাজে মনোযোগ দিতে অসুবিধা',
  'Persistent weakness': 'সার্বক্ষণিক দুর্বলতা',
  'Sleep disturbances': 'ঘুমের সমস্যা',
  'Unexplained sadness or low mood': 'অকারণে মন খারাপ বা বিষণ্ণতা',
  'Frequent setbacks in personal, family, or work life': 'ব্যক্তিগত, পারিবারিক বা কর্মজীবনে বারবার ব্যর্থতা',

  'Persistent heaviness in the head': 'মাথায় স্থায়ী ভারবোধ বা চাপ',
  'Sudden muscle spasms or involuntary twitching': 'শরীরের বিভিন্ন অংশে হঠাৎ খিঁচুনি বা কাঁপুনি',
  'Unexplained chest tightness or suffocation': 'বুকে ভারী চাপ বা দমবন্ধ অনুভূতি',
  'Frequent stomach issues or nausea without cause': 'পেটের সমস্যা বা অকারণে বমি বমি ভাব',
  'Numbness or tingling in hands or feet': 'হাত-পা অবশ হওয়া বা ঝিঁঝিঁ ধরা',
  'Unusual body temperature fluctuations': 'শরীরের তাপমাত্রা ওঠানামা করা',
  'Sudden unexplained vision blurriness': 'হঠাৎ চোখে ঝাপসা দেখা',
  'Chronic fatigue': 'স্থায়ী ক্লান্তি ও অবসাদ',
  'Pain shifting to different parts of the body': 'শরীরের বিভিন্ন অংশে ব্যথা স্থান পরিবর্তন করা',
  'Sudden rapid heart rate or palpitations': 'হঠাৎ বুক ধড়ফড় করা',

  'Difficulty falling asleep': 'দেরিতে ঘুম আসা বা সহজে ঘুম না হওয়া',
  'Waking up repeatedly': 'রাতে বারবার ঘুম ভেঙে যাওয়া',
  'Waking up terrified with fear': 'ঘুম থেকে তীব্র ভয় বা আতঙ্ক নিয়ে জেগে ওঠা',
  'Teeth grinding in sleep': 'ঘুমের মধ্যে অনিচ্ছাকৃত দাঁত কিড়মিড় করা',
  'Feeling choked or suffocated in sleep': 'ঘুমের মধ্যে দমবন্ধ হওয়া বা চাপ অনুভব করা',
  'Sleep paralysis (Kaboos)': 'বোবায় ধরা / স্লিপ প্যারালাইসিস (কাবূস)',
  'Excessive sleeping and difficulty waking': 'অতিরিক্ত ঘুমানো এবং জাগতে তীব্র কষ্ট',
  'Sweating profusely during sleep': 'ঘুমানোর সময় অতিরিক্ত ঘাম হওয়া',
  'Moaning, talking, or screaming during sleep': 'ঘুমের মধ্যে চিৎকার, গোঙানি বা কথা বলা',
  'Feeling unrefreshed despite long sleep': 'দীর্ঘ ঘুমের পরও ক্লান্ত বা অপূর্ণ মনে হওয়া',

  'Snakes, scorpions, or insects attacking': 'সাপ, বিচ্ছু বা পোকা-মাকড় আক্রমণ করার দুঃস্বপ্ন',
  'Black dogs, cats, or beasts attacking': 'কালো কুকুর, বিড়াল বা হিংস্র পশুর আক্রমণ',
  'Falling from a high place or roof': 'উঁচু স্থান বা ছাদ থেকে নিচে পড়ে যাওয়ার দুঃস্বপ্ন',
  'Seeing dead people or graves repeatedly': 'মৃত ব্যক্তি বা কবরস্থান বারবার দেখা',
  'Seeing scary figures or ghosts': 'ভীতিকর ছায়া, আকৃতি বা ভূত-প্রেত দেখা',
  'Drowning in deep water': 'গভীর পানিতে ডুবে যাওয়ার দুঃস্বপ্ন',
  'Being trapped in dark, closed, or filthy places': 'অন্ধকার, আবদ্ধ বা নোংরা স্থানে আটকে পড়া',
  'Being chased or attacked by enemies': 'শত্রু দ্বারা তাড়া খাওয়া বা আক্রান্ত হওয়ার দুঃস্বপ্ন',
  'Blood, animal slaughter, or raw meat in dreams': 'রক্ত, পশু জবাই বা কাঁচা মাংস দেখার দুঃস্বপ্ন',
  'Seeing oneself flying or floating': 'নিজেকে শূন্যে উড়তে বা ভাসতে দেখার স্বপ্ন',

  'Aversion to hearing the Adhan or Quran': 'আযান বা কুরআন তিলাওয়াত শুনতে তীব্র অস্বস্তি',
  'Severe intrusive doubts (Waswas) in Wudu / Salah': 'অজু ও সালাতে তীব্র ওয়াসওয়াসা ও ভুল হওয়ার অনুভূতি',
  'Sudden drowsiness during Quran recitation or prayer': 'কুরআন তিলাওয়াত বা সালাতের সময় অস্বাভাবিক তন্দ্রাচ্ছন্নতা',
  'Avoiding congregational prayer or mosques': 'জামাতে সালাত বা মসজিদে যেতে অহেতুক অনীহা',
  'Difficulty remembering Islamic duties': 'ইসলামিক ফরজ আমলগুলো মনে রাখতে অস্বাভাবিক কষ্ট',
  'Intrusive inappropriate thoughts during worship': 'ইবাদতের সময় অন্তরে কুচিন্তা বা খারাপ ভাব আসা',
  'Sudden anger during religious discussions': 'দ্বীনি কথা বা আলোচনা শুনলে হঠাৎ রাগ হওয়া',
  'Neglecting morning and evening Adhkar': 'সকাল-সন্ধ্যার মাসনূন আজকার আদায়ে অনীহা বা অবহেলা',
  'Heaviness in tongue during Dhikr': 'যিকির করার সময় জিহ্বায় ভারী লাগা বা কথা আটকে যাওয়া',
  'Feeling repelled from virtuous deeds': 'নেক আমল করতে তীব্র অনিচ্ছা বা বাধা অনুভব',

  'Sudden unwarranted extreme anger': 'হঠাৎ অহেতুক চরম রাগ ও ক্ষোভ',
  'Unjustified suspicion or hatred toward spouse': 'স্ত্রী বা স্বামীর প্রতি অহেতুক ঘৃণা বা সন্দেহ',
  'Dislike of being with family members': 'পরিবারের সদস্যদের সাথে থাকতে অস্বস্তি ও অনীহা',
  'Preference for dark, dirty, or isolated rooms': 'অন্ধকার, নোংরা বা নির্জন ঘরে একাকী থাকার প্রবল ইচ্ছা',
  'Thoughts of running away or disappearing': 'ঘর ছেড়ে পালিয়ে যাওয়া বা হারিয়ে যাওয়ার চিন্তা',
  'Feeling constantly watched or followed': 'কেউ সার্বক্ষণিক দেখছে বা অনুসরণ করছে এমন অনুভূতি',
  'Unprovoked sudden crying or emotional breakdown': 'অকারণে হঠাৎ কান্না বা মানসিক ভেঙে পড়া',
  'Hearing whispering sounds or voices when alone': 'একা থাকলে ফিসফিস শব্দ বা ডাক শুনতে পাওয়া',
  'Extreme mood swings': 'মুহূর্তের মধ্যে মেজাজ পরিবর্তন হওয়া',
  'Suicidal or self-harm thoughts': 'আত্মহত্যার চিন্তা বা নিজেকে আঘাত করার প্রবণতা',

  'Sudden loss of sexual desire with spouse': 'স্বামীর/স্ত্রীর সাথে সম্পর্কের আগ্রহ হঠাৎ নষ্ট হওয়া',
  'Sudden disruption of proposed marriage without valid reason': 'বিনা কারণে ভালো বিয়ের প্রস্তাব বারবার ভেঙে যাওয়া',
  'Unbearable physical pain during marital relations': 'দাম্পত্য মিলনের সময় তীব্র শারীরিক ব্যথা বা বাধা',
  'Repulsion toward spouse\'s appearance or scent': 'সঙ্গীর চেহারা বা গন্ধ সহ্য করতে না পারা',
  'Constant arguments over trivial domestic matters': 'তুচ্ছ বিষয়ে ঘরে সার্বক্ষণিক ঝগড়া-বিবাদ লেগে থাকা',
  'Sudden unexplained business decline or career failure': 'ব্যবসায় বা ক্যারিয়ারে হঠাৎ বড় ধরনের অচলাবস্থা',
  'Repeated loss of wealth through unexpected calamities': 'অপ্রত্যাশিত বিপদে বারবার আর্থিক ক্ষতি হওয়া',
  'Unwillingness to work or look for livelihood': 'কাজে যাওয়ার বা রুজি অর্জনের প্রতি তীব্র অনীহা',
  'Feeling of blockage or deadlock in all endeavors': 'সব কাজে অদৃশ্য বাধা বা পথ রুদ্ধ মনে হওয়া',
  'Loss of interest in life and progress': 'জীবনের উন্নতি বা অগ্রগতির প্রতি আগ্রহ হারিয়ে ফেলা',

  'Repeated normal medical test results despite severe illness': 'তীব্র অসুস্থতা সত্ত্বেও সব মেডিকেল টেস্ট নরমাল আসা',
  'Medicines showing no positive effect': 'ডাক্তারি ওষুধে কোনো প্রকার কাজ না করা',
  'Physical pain shifting when medicine is taken': 'ওষুধ সেবনের পর ব্যথা অন্যত্র স্থানান্তরিত হওয়া',
  'Sudden severe illness with no medical diagnosis': 'হঠাৎ তীব্র রোগ যার কোনো ডায়াগনোসিস নেই',
  'Frequent relapsing skin diseases without clear cause': 'ত্বকে বারবার অদ্ভুত রোগ দেখা দেওয়া',
  'Hair falling out in unusual patterns': 'অস্বাভাবিক হারে চুল পড়া',
  'Bruises or marks appearing on body upon waking': 'ঘুম থেকে ওঠার পর শরীরে নীল দাগ বা আচড় দেখা যাওয়া',
  'Sudden weight loss without diet or disease': 'কোনো রোগ ছাড়া হঠাৎ ওজন দ্রুত কমে যাওয়া',
  'Pain increasing during Friday or Azan times': 'জুমার দিন বা আযানের সময় ব্যথা বৃদ্ধি পাওয়া',
  'Doctors confused by conflicting symptoms': 'ডাক্তারদের দ্বারা রোগের কারণ চিহ্নিত করতে না পারা',

  'Prior visits to superstitious healers or talisman sellers': 'পূর্বে কবিরাজ, তান্ত্রিক বা তাবিয গ্রহণে যাওয়া',
  'Use of copper, thread, or paper amulets (now removed)': 'তামা, সুতা বা কাগজের তাবিয ব্যবহার (বর্তমানে অপসারিত)',
  'Presence of strange locked items or knotted strings at home': 'ঘরে অদ্ভুত গিট দেওয়া সুতা বা লুকানো বস্তু পাওয়া',
  'Suspicion of consumed or stepped-on Sihr (Magic)': 'খাওয়ানো বা ছিটানো জাদুর প্রভাবের সন্দেহ',
  'Family history of mysterious afflictions': 'পরিবারে একই ধরনের রহস্যময় অসুস্থতার ধারাবাহিকতা',
  'Sudden distress right after compliments or envious looks': 'প্রশংসা বা হিংসার নজরের পরেই অসুস্থতা শুরু হওয়া',
  'Persistent bad luck or misfortune following envy': 'হিংসুক মানুষের সংস্পর্শের পর দুর্ভাগ্য শুরু হওয়া',
  'Reactions worsen during Quran recitation': 'কুরআন তিলাওয়াত শুনলে লক্ষণগুলো তীব্রতর হওয়া',
  'Unusual feelings of presence in the room': 'ঘরে অদৃশ্য কারও উপস্থিতি অনুভব করা',
  'Spontaneous movement of objects at home': 'ঘরের জিনিসপত্র নিজে নিজে নড়াচড়া করার অনুভূতি'
};

function toBengaliDigits(num) {
  if (num === null || num === undefined) return '';
  const bn = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return String(num).replace(/[0-9]/g, d => bn[parseInt(d, 10)]);
}

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function translateClinicalItem(term, targetLang = 'bn') {
  if (!term) return '';
  const clean = String(term).trim();
  if (targetLang === 'bn') {
    if (CLINICAL_TRANSLATIONS[clean]) return CLINICAL_TRANSLATIONS[clean];
    for (const [enKey, bnVal] of Object.entries(CLINICAL_TRANSLATIONS)) {
      if (clean.toLowerCase() === enKey.toLowerCase()) return bnVal;
    }
    return toBengaliDigits(clean);
  } else {
    for (const [enKey, bnVal] of Object.entries(CLINICAL_TRANSLATIONS)) {
      if (clean === bnVal || clean.toLowerCase() === bnVal.toLowerCase()) return enKey;
    }
    if (CLINICAL_TRANSLATIONS[clean]) return clean;
    for (const enKey of Object.keys(CLINICAL_TRANSLATIONS)) {
      if (clean.toLowerCase() === enKey.toLowerCase()) return enKey;
    }
    const bnToEnDigits = { '০':'0', '১':'1', '২':'2', '৩':'3', '৪':'4', '৫':'5', '৬':'6', '৭':'7', '৮':'8', '৯':'9' };
    return clean.replace(/[০-৯]/g, d => bnToEnDigits[d] || d);
  }
}

function resolvePatientSymptoms(patientId, diagnosis, history) {
  let categoriesMap = new Map();

  // 1. Process from diagnosis if exists
  if (diagnosis) {
    let symIds = [];
    if (diagnosis.selected_symptom_ids) {
      try {
        const parsed = typeof diagnosis.selected_symptom_ids === 'string'
          ? JSON.parse(diagnosis.selected_symptom_ids)
          : diagnosis.selected_symptom_ids;
        if (Array.isArray(parsed)) symIds = parsed.map(Number).filter(Boolean);
      } catch (e) {}
    }

    if (symIds.length > 0) {
      const placeholders = symIds.map(() => '?').join(',');
      const rows = db.prepare(`
        SELECT 
          s.id as symptom_id, s.category_id, s.symptom_bn, s.symptom_en, s.sort_order as symptom_sort,
          c.id as cat_id, c.code as category_code, c.name_bn as category_name_bn, c.name_en as category_name_en, c.sort_order as category_sort
        FROM diagnosis_symptoms s
        JOIN diagnosis_categories c ON s.category_id = c.id
        WHERE s.id IN (${placeholders})
        ORDER BY c.sort_order ASC, s.sort_order ASC
      `).all(...symIds);

      for (const row of rows) {
        if (!categoriesMap.has(row.category_id)) {
          categoriesMap.set(row.category_id, {
            category_id: row.category_id,
            category_code: row.category_code,
            name_bn: row.category_name_bn,
            name_en: row.category_name_en,
            sort_order: row.category_sort,
            symptoms: []
          });
        }
        categoriesMap.get(row.category_id).symptoms.push({
          id: row.symptom_id,
          name_bn: row.symptom_bn,
          name_en: row.symptom_en
        });
      }
    }

    // Also check selected_symptoms_json for any symptoms or custom text
    if (diagnosis.selected_symptoms_json) {
      try {
        const parsedJson = typeof diagnosis.selected_symptoms_json === 'string'
          ? JSON.parse(diagnosis.selected_symptoms_json)
          : diagnosis.selected_symptoms_json;
        if (Array.isArray(parsedJson)) {
          for (const cat of parsedJson) {
            const catId = cat.category_id || cat.id || 99;
            if (!categoriesMap.has(catId)) {
              categoriesMap.set(catId, {
                category_id: catId,
                category_code: cat.category_code || '',
                name_bn: cat.category_name_bn || cat.name_bn || '',
                name_en: cat.category_name_en || cat.name_en || '',
                sort_order: cat.sort_order || 99,
                symptoms: []
              });
            }
            const existingSymNames = new Set(categoriesMap.get(catId).symptoms.map(s => s.name_bn || s.name_en));
            for (const s of (cat.symptoms || [])) {
              const bnText = s.symptom_bn || s.name_bn || s.symptom_name_bn;
              const enText = s.symptom_en || s.name_en || s.symptom_name_en;
              if (bnText && existingSymNames.has(bnText)) continue;
              if (enText && existingSymNames.has(enText)) continue;
              categoriesMap.get(catId).symptoms.push({
                id: s.id || null,
                name_bn: bnText || translateClinicalItem(enText, 'bn'),
                name_en: enText || translateClinicalItem(bnText, 'en')
              });
            }
          }
        }
      } catch (e) {}
    }
  }

  // 2. Supplement from history for older records
  if (history) {
    const parseListSafe = (str) => {
      if (!str) return [];
      try {
        const p = JSON.parse(str);
        return Array.isArray(p) ? p : [String(str)];
      } catch {
        return [String(str)];
      }
    };

    const histCatMap = [
      { key: 'main_symptoms', catId: 1, name_bn: 'প্রধান সমস্যা ও অভিযোগ', name_en: 'Main Complaints & Presenting Symptoms' },
      { key: 'physical_symptoms', catId: 2, name_bn: 'শারীরিক অসুস্থতা ও রোগের অস্বাভাবিকতা', name_en: 'Physical Symptoms & Health Complaints' },
      { key: 'sleep_problems', catId: 3, name_bn: 'ঘুমের সমস্যা', name_en: 'Sleep-Related Problems' },
      { key: 'dream_problems', catId: 4, name_bn: 'স্বপ্নে ভীতিকর বিষয় ও দুঃস্বপ্ন', name_en: 'Bad Dreams & Nightmare Patterns' },
      { key: 'worship_problems', catId: 5, name_bn: 'ইবাদত ও দ্বীনি আমলের অবস্থা', name_en: 'Religious Practice & Spiritual State' }
    ];

    for (const hCat of histCatMap) {
      const items = parseListSafe(history[hCat.key]);
      if (items.length > 0) {
        if (!categoriesMap.has(hCat.catId)) {
          categoriesMap.set(hCat.catId, {
            category_id: hCat.catId,
            category_code: hCat.key,
            name_bn: hCat.name_bn,
            name_en: hCat.name_en,
            sort_order: hCat.catId,
            symptoms: []
          });
        }
        const existingSymNames = new Set(categoriesMap.get(hCat.catId).symptoms.map(s => s.name_bn || s.name_en));
        for (const item of items) {
          if (!item || !item.trim()) continue;
          const cleanItem = item.trim();
          if (cleanItem === 'None recorded' || cleanItem === 'লক্ষণ রেকর্ড করা হয়নি' || cleanItem === 'No disruption reported' || cleanItem === 'ঘুমের ব্যাঘাত নেই') continue;
          if (!existingSymNames.has(cleanItem)) {
            let dbMatch = null;
            try {
              dbMatch = db.prepare('SELECT symptom_bn, symptom_en FROM diagnosis_symptoms WHERE symptom_bn = ? OR symptom_en = ?').get(cleanItem, cleanItem);
            } catch (e) {}
            categoriesMap.get(hCat.catId).symptoms.push({
              id: null,
              name_bn: dbMatch ? dbMatch.symptom_bn : translateClinicalItem(cleanItem, 'bn'),
              name_en: dbMatch ? dbMatch.symptom_en : translateClinicalItem(cleanItem, 'en')
            });
          }
        }
      }
    }
  }

  // Filter out any categories with 0 symptoms
  const activeCategories = Array.from(categoriesMap.values()).filter(c => c.symptoms && c.symptoms.length > 0);
  activeCategories.sort((a, b) => a.sort_order - b.sort_order);

  return activeCategories;
}

function wrapText(text, maxChars = 52) {
  if (!text) return [];
  if (text.length <= maxChars) return [text];
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (!cur) {
      cur = w;
    } else if ((cur + ' ' + w).length <= maxChars) {
      cur += ' ' + w;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function buildPatientHistorySvg(patient, history, diagnosis, lang = 'bn') {
  const isBn = lang === 'bn';
  const width = 1240;
  const height = 1754;

  const t = {
    clinicName: isBn ? 'রুকইয়াহ সাপোর্ট এন্ড কাপিং সেন্টার' : 'RUQYAH SUPPORT & CUPPING CENTER',
    clinicSub: isBn ? 'ফেনী শাখা  |  ভূঞা ম্যানশন, আদর্শ হাউজিং সোসাইটি, মহিপাল, ফেনী' : 'FENI BRANCH  |  Bhuya Mansion, Adarsha Housing Society, Mohipal, Feni',
    phoneRaqi: isBn ? 'হটলাইন / হোয়াটসঅ্যাপ: ০১৭৫৮-৩৫৪৯২০  |  পরিচালক ও প্রধান রাকি: মুহাম্মদুল্লাহ মিয়া' : 'Hotline / WhatsApp: 01758-354920  |  Lead Raqi: Muhammadullah Miah',
    reportTitle: isBn ? 'রোগীর পূর্ণাঙ্গ স্বাস্থ্য বিবরণী ও হিস্ট্রি রিপোর্ট' : 'PATIENT CLINICAL HISTORY REPORT',
    ref: isBn ? `রেফারেন্স: ${patient.patient_id}` : `Ref: ${patient.patient_id}`,
    date: isBn ? `তারিখ: ${toBengaliDigits(new Date().toISOString().split('T')[0])}` : `Date: ${new Date().toISOString().split('T')[0]}`,
    demographics: isBn ? 'রোগীর সাধারণ পরিচিতি ও তথ্য' : 'PATIENT IDENTIFICATION & DEMOGRAPHICS',
    pId: isBn ? 'রোগী আইডি' : 'Patient ID',
    pName: isBn ? 'রোগীর পূর্ণ নাম' : 'Full Name',
    pAgeGender: isBn ? 'বয়স ও লিঙ্গ' : 'Age / Gender',
    pPhone: isBn ? 'মোবাইল নম্বর' : 'Phone Number',
    pEmergency: isBn ? 'জরুরি যোগাযোগ' : 'Emergency Contact',
    pMarital: isBn ? 'বৈবাহিক অবস্থা' : 'Marital Status',
    pAddress: isBn ? 'বর্তমান ঠিকানা' : 'Address',
    diagSecTitle: isBn ? 'ক্লিনিক্যাল ডায়াগনোসিস ও রোগীর নির্বাচিত উপসর্গসমূহ' : 'CLINICAL DIAGNOSIS & PATIENT REPORTED SYMPTOMS',
    shifaNotice: isBn
      ? 'গোপনীয় স্বাস্থ্য বিবরণী — শিফা ও পূর্ণ আরোগ্য একমাত্র আল্লাহ তা\'আলার পক্ষ থেকে অবতীর্ণ হয়। রুকইয়াহ হলো সুন্নাহসম্মত উপায়।'
      : 'CONFIDENTIAL HEALTH RECORD — Healing (Shifa) is exclusively in the hands of Allah. Ruqyah is an authentic prophetic means.',
    raqiSign: isBn ? 'মুহাম্মদুল্লাহ মিয়া' : 'Muhammadullah Miah',
    raqiTitle: isBn ? 'কনসালট্যান্ট রাকি ও সুন্নাহ প্র্যাকটিশনার' : 'Consultant Raqi & Sunnah Practitioner'
  };

  let svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        ${fontBase64 ? `
        @font-face {
          font-family: 'Noto Sans Bengali';
          src: url('data:font/truetype;charset=utf-8;base64,${fontBase64}') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        ` : ''}
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
    <rect x="50" y="40" width="${width - 100}" height="10" fill="#0F5132" rx="3" />
    
    <!-- Header: Clinic Info -->
    <g transform="translate(50, 65)">
      <g transform="translate(0, 25)">
        <text class="font-base" font-size="25" font-weight="bold" fill="#0F5132">${escapeXml(t.clinicName)}</text>
        <text class="font-base" font-size="13.5" fill="#4B5563" y="26">${escapeXml(t.clinicSub)}</text>
        <text class="font-base" font-size="13" fill="#059669" font-weight="600" y="48">${escapeXml(t.phoneRaqi)}</text>
      </g>
    </g>

    <!-- Badge Header Right -->
    <g transform="translate(860, 65)">
      <rect width="330" height="90" rx="8" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1.5" />
      <text class="font-base" x="20" y="32" font-size="13.5" font-weight="bold" fill="#065F46">${escapeXml(t.reportTitle)}</text>
      <text class="font-base" x="20" y="56" font-size="13" fill="#1E293B">${escapeXml(t.ref)}</text>
      <text class="font-base" x="20" y="76" font-size="12" fill="#64748B">${escapeXml(t.date)}</text>
    </g>

    <!-- Divider Line -->
    <line x1="50" y1="170" x2="${width - 50}" y2="170" stroke="#CBD5E1" stroke-width="1.5" />

    <!-- Demographics Card -->
    <g transform="translate(50, 185)">
      <rect width="${width - 100}" height="115" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
      <rect x="0" y="0" width="${width - 100}" height="28" rx="8" fill="#F1F5F9" />
      <text class="font-base" x="20" y="19" font-size="12.5" font-weight="bold" fill="#0F5132">${escapeXml(t.demographics)}</text>
      
      <!-- Row 1 -->
      <text class="font-base" x="20" y="52" font-size="11.5" fill="#64748B">${escapeXml(t.pId)}: <tspan font-weight="bold" fill="#064E3B">${escapeXml(patient.patient_id)}</tspan></text>
      <text class="font-base" x="380" y="52" font-size="11.5" fill="#64748B">${escapeXml(t.pName)}: <tspan font-weight="bold" fill="#0F172A">${escapeXml(patient.full_name)}</tspan></text>
      <text class="font-base" x="780" y="52" font-size="11.5" fill="#64748B">${escapeXml(t.pAgeGender)}: <tspan font-weight="bold" fill="#0F172A">${isBn ? toBengaliDigits(patient.age) + ' বছর' : patient.age + ' Yrs'} / ${escapeXml(translateClinicalItem(patient.gender || 'Unspecified', isBn ? 'bn' : 'en'))}</tspan></text>
      
      <!-- Row 2 -->
      <text class="font-base" x="20" y="76" font-size="11.5" fill="#64748B">${escapeXml(t.pPhone)}: <tspan font-weight="bold" fill="#0F172A">${isBn ? toBengaliDigits(patient.phone) : escapeXml(patient.phone)}</tspan></text>
      <text class="font-base" x="380" y="76" font-size="11.5" fill="#64748B">${escapeXml(t.pEmergency)}: <tspan fill="#0F172A">${escapeXml(patient.emergency_contact && patient.emergency_contact !== 'N/A' ? (isBn ? toBengaliDigits(patient.emergency_contact) : patient.emergency_contact) : (isBn ? 'প্রযোজ্য নয়' : 'N/A'))}</tspan></text>
      <text class="font-base" x="780" y="76" font-size="11.5" fill="#64748B">${escapeXml(t.pMarital)}: <tspan fill="#0F172A">${escapeXml(translateClinicalItem(patient.marital_status || 'N/A', isBn ? 'bn' : 'en'))}</tspan></text>
      
      <!-- Row 3 -->
      <text class="font-base" x="20" y="99" font-size="11.5" fill="#64748B">${escapeXml(t.pAddress)}: <tspan fill="#0F172A">${escapeXml(translateClinicalItem(patient.address, isBn ? 'bn' : 'en'))}</tspan></text>
    </g>
  `;

  let curY = 315;

  // Suicidal Ideation Alert Banner if flagged
  if (diagnosis && diagnosis.suicidal_ideation_flag === 1) {
    const alertMsg = isBn 
      ? '⚠️ [জরুরি সতর্কতা]: আত্মহত্যার চিন্তা বা সেলফ-হার্ম চিহ্নিত হয়েছে। মানসিক স্বাস্থ্য বিশেষজ্ঞের শরণাপন্ন হওয়া নিশ্চিত করুন।'
      : '⚠️ [URGENT CLINICAL ALERT]: Suicidal ideation or self-harm reported. Professional psychiatric referral required.';
    svg += `
      <g transform="translate(50, ${curY})">
        <rect width="${width - 100}" height="32" rx="6" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.5" />
        <text class="font-base" x="20" y="21" font-size="11.5" font-weight="bold" fill="#991B1B">${escapeXml(alertMsg)}</text>
      </g>
    `;
    curY += 40;
  }

  // Active Symptoms Resolved
  const activeCategories = resolvePatientSymptoms(patient.patient_id, diagnosis, history);

  if (activeCategories.length > 0) {
    // Section Header
    svg += `
      <g transform="translate(50, ${curY})">
        <rect width="${width - 100}" height="28" rx="6" fill="#064E3B" />
        <text class="font-base" x="18" y="19" font-size="12" font-weight="bold" fill="#FFFFFF">🩺 ${escapeXml(t.diagSecTitle)}</text>
      </g>
    `;
    curY += 34;

    for (const cat of activeCategories) {
      const catName = isBn ? cat.name_bn : cat.name_en;
      const countLabel = isBn ? `(${toBengaliDigits(cat.symptoms.length)}টি লক্ষণ)` : `(${cat.symptoms.length} Symptoms)`;

      // Build symptom row lines
      const symRows = [];
      for (let i = 0; i < cat.symptoms.length; i += 2) {
        const s1 = cat.symptoms[i];
        const s2 = cat.symptoms[i + 1] || null;
        const text1 = isBn ? s1.name_bn : s1.name_en;
        const text2 = s2 ? (isBn ? s2.name_bn : s2.name_en) : '';

        const lines1 = wrapText(text1, 52);
        const lines2 = s2 ? wrapText(text2, 52) : [];
        const maxLines = Math.max(lines1.length, lines2.length, 1);
        symRows.push({ lines1, lines2, maxLines });
      }

      const totalSymptomsHeight = symRows.reduce((sum, r) => sum + (r.maxLines * 18) + 4, 0);
      const catBoxHeight = 28 + totalSymptomsHeight + 10;

      svg += `
        <g transform="translate(50, ${curY})">
          <rect width="${width - 100}" height="${catBoxHeight}" rx="6" fill="#FAFDFB" stroke="#A7F3D0" stroke-width="1.2" />
          <rect x="0" y="0" width="${width - 100}" height="26" rx="6" fill="#ECFDF5" />
          <rect x="0" y="0" width="4" height="26" fill="#059669" />
          <text class="font-base" x="16" y="18" font-size="12" font-weight="bold" fill="#065F46">❖ ${escapeXml(catName)} <tspan font-weight="normal" font-size="10.5" fill="#047857">${escapeXml(countLabel)}</tspan></text>
      `;

      let symY = 46;
      for (const row of symRows) {
        // Col 1
        for (let lIdx = 0; lIdx < row.lines1.length; lIdx++) {
          if (lIdx === 0) {
            svg += `
              <text class="font-base" x="20" y="${symY + (lIdx * 18)}" font-size="11" fill="#1E293B">
                <tspan fill="#059669" font-weight="bold">✔ </tspan>${escapeXml(row.lines1[lIdx])}
              </text>
            `;
          } else {
            svg += `
              <text class="font-base" x="38" y="${symY + (lIdx * 18)}" font-size="11" fill="#475569">
                ${escapeXml(row.lines1[lIdx])}
              </text>
            `;
          }
        }
        // Col 2
        if (row.lines2.length > 0) {
          for (let lIdx = 0; lIdx < row.lines2.length; lIdx++) {
            if (lIdx === 0) {
              svg += `
                <text class="font-base" x="580" y="${symY + (lIdx * 18)}" font-size="11" fill="#1E293B">
                  <tspan fill="#059669" font-weight="bold">✔ </tspan>${escapeXml(row.lines2[lIdx])}
                </text>
              `;
            } else {
              svg += `
                <text class="font-base" x="598" y="${symY + (lIdx * 18)}" font-size="11" fill="#475569">
                  ${escapeXml(row.lines2[lIdx])}
                </text>
              `;
            }
          }
        }
        symY += (row.maxLines * 18) + 4;
      }

      svg += `</g>`;
      curY += catBoxHeight + 10;
    }
  } else {
    // No symptoms recorded
    svg += `
      <g transform="translate(50, ${curY})">
        <rect width="${width - 100}" height="42" rx="6" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1" />
        <text class="font-base" x="20" y="26" font-size="12" fill="#64748B">${isBn ? 'রোগীর জন্য এখনও কোনো নির্দিষ্ট উপসর্গ বা ডায়াগনোসিস রেকর্ড পাওয়া যায়নি।' : 'No specific symptoms or diagnosis recorded for this patient.'}</text>
      </g>
    `;
    curY += 52;
  }

  // Clinical Details & Notes (Render ONLY if non-empty!)
  const clinicalCards = [];

  if (diagnosis && diagnosis.main_complaints_text && diagnosis.main_complaints_text.trim()) {
    clinicalCards.push({
      label: isBn ? 'প্রধান সমস্যা ও অভিযোগের বিস্তারিত বিবরণ' : 'Chief Complaints & Presenting Detail',
      value: diagnosis.main_complaints_text.trim()
    });
  }

  const durationVal = history?.problem_duration || history?.duration_of_problems;
  if (durationVal && durationVal.trim() && durationVal !== 'Not specified' && durationVal !== 'নির্দিষ্ট নয়') {
    clinicalCards.push({
      label: isBn ? 'সমস্যার মেয়াদকাল / সময়কাল' : 'Problem Duration & Timeline',
      value: translateClinicalItem(durationVal, isBn ? 'bn' : 'en')
    });
  }

  if (diagnosis && diagnosis.onset_history_notes && diagnosis.onset_history_notes.trim()) {
    clinicalCards.push({
      label: isBn ? 'সমস্যা শুরুর প্রেক্ষাপট ও পটভূমি' : 'Onset History & Circumstances',
      value: diagnosis.onset_history_notes.trim()
    });
  }

  const prevMed = history?.previous_treatment_history || history?.previous_medical_history;
  if (prevMed && prevMed.trim() && prevMed !== 'No prior medical reports recorded.' && prevMed !== 'পূর্ববর্তী কোনো চিকিৎসা ইতিহাস নেই') {
    clinicalCards.push({
      label: isBn ? 'পূর্ববর্তী চিকিৎসা ও টেস্টের ফলাফল' : 'Prior Medical & Treatment History',
      value: translateClinicalItem(prevMed, isBn ? 'bn' : 'en')
    });
  }

  const famVal = diagnosis?.family_social_notes || history?.family_history;
  if (famVal && famVal.trim() && famVal !== 'Unremarkable' && famVal !== 'স্বাভাবিক') {
    clinicalCards.push({
      label: isBn ? 'পারিবারিক ও সামাজিক প্রেক্ষাপট' : 'Family & Social Context',
      value: famVal.trim()
    });
  }

  const notesVal = diagnosis?.notes || history?.additional_information || patient?.notes;
  if (notesVal && notesVal.trim() && notesVal !== 'No additional clinical remarks recorded.' && notesVal !== 'কোনো অতিরিক্ত ক্লিনিক্যাল মন্তব্য নেই।') {
    clinicalCards.push({
      label: isBn ? 'রাক্বীর ক্লিনিক্যাল পর্যবেক্ষণ ও কেস নোট' : 'Raqi Clinical Observations & Case Notes',
      value: translateClinicalItem(notesVal, isBn ? 'bn' : 'en')
    });
  }

  if (clinicalCards.length > 0) {
    for (const card of clinicalCards) {
      const lines = wrapText(card.value, 115);
      const cardHeight = 26 + (lines.length * 18) + 8;
      svg += `
        <g transform="translate(50, ${curY})">
          <rect width="${width - 100}" height="${cardHeight}" rx="6" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.2" />
          <rect x="0" y="0" width="${width - 100}" height="24" rx="6" fill="#F8FAFC" />
          <rect x="0" y="0" width="4" height="24" fill="#059669" />
          <text class="font-base" x="16" y="17" font-size="11.5" font-weight="bold" fill="#0F5132">${escapeXml(card.label)}</text>
      `;
      let lineY = 40;
      for (const line of lines) {
        svg += `
          <text class="font-base" x="20" y="${lineY}" font-size="11" fill="#334155">${escapeXml(line)}</text>
        `;
        lineY += 18;
      }
      svg += `</g>`;
      curY += cardHeight + 8;
    }
  }

  // Footer & Signatures Block
  svg += `
    <g transform="translate(50, 1620)">
      <line x1="0" y1="0" x2="${width - 100}" y2="0" stroke="#CBD5E1" stroke-width="1.5" />
      
      <!-- Seal Stamp Placeholder Box -->
      <g transform="translate(540, 15)">
        <rect width="180" height="65" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1" stroke-dasharray="4,4" rx="4" />
        <text class="font-base" x="90" y="38" font-size="11" fill="#64748B" font-weight="600" text-anchor="middle">${isBn ? '[ ক্লিনিক অফিসিয়াল সিল ]' : '[ CLINIC OFFICIAL SEAL ]'}</text>
      </g>

      <!-- Signature Line -->
      <g transform="translate(860, 45)">
        <line x1="0" y1="0" x2="260" y2="0" stroke="#0F172A" stroke-width="1.5" />
        <text class="font-base" x="130" y="20" font-size="13" font-weight="bold" fill="#0F172A" text-anchor="middle">${escapeXml(t.raqiSign)}</text>
        <text class="font-base" x="130" y="36" font-size="11" fill="#475569" text-anchor="middle">${escapeXml(t.raqiTitle)}</text>
      </g>

      <!-- Shifa Notice -->
      <text class="font-base" x="0" y="30" font-size="11.5" font-weight="bold" fill="#065F46">${escapeXml(t.shifaNotice)}</text>
      <text class="font-base" x="0" y="50" font-size="10.5" fill="#64748B">${escapeXml(isBn ? 'সিস্টেম জেনারেটেড ডিজিটাল রিপোর্ট — রুকইয়াহ সাপোর্ট এন্ড কাপিং সেন্টার (ফেনী শাখা)' : 'System Generated Health Dossier — Ruqyah Support & Cupping Center (Feni Branch)')}</text>
    </g>
  </svg>
  `;

  return svg;
}

async function run() {
  const patient = db.prepare('SELECT * FROM patients WHERE patient_id = ?').get('RSCC-P-1125');
  const diagnosis = db.prepare('SELECT * FROM patient_diagnoses WHERE patient_id = ?').get('RSCC-P-1125');
  const history = db.prepare('SELECT * FROM patient_histories WHERE patient_id = ?').get('RSCC-P-1125');

  console.log('Generating test BN SVG...');
  const svgBn = buildPatientHistorySvg(patient, history, diagnosis, 'bn');
  const imgBn = await sharp(Buffer.from(svgBn)).jpeg({ quality: 95 }).toBuffer();
  fs.writeFileSync(path.join(__dirname, 'test_resolved_patient_bn.jpg'), imgBn);
  console.log('Saved test_resolved_patient_bn.jpg (size:', imgBn.length, 'bytes)');

  console.log('Generating test EN SVG...');
  const svgEn = buildPatientHistorySvg(patient, history, diagnosis, 'en');
  fs.writeFileSync(path.join(__dirname, 'debug_en.svg'), svgEn);
  const imgEn = await sharp(Buffer.from(svgEn)).jpeg({ quality: 95 }).toBuffer();
  fs.writeFileSync(path.join(__dirname, 'test_resolved_patient_en.jpg'), imgEn);
  console.log('Saved test_resolved_patient_en.jpg (size:', imgEn.length, 'bytes)');
}

run().catch(console.error);
