const fs = require('fs');

const path = './test/system.test.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Update session recording test to include new fields
const oldSessionTest = `  // 11. Ruqyah Diagnosis & Session Recording
  let recordedSessionId = '';
  await test('Ruqyah Session Recording: verses, reactions, Raqi professional assessment', async () => {
    const sessionPayload = {
      patient_id: testPatientId,
      session_date: new Date().toISOString().split('T')[0],
      raqi_name: 'Muhammadullah Miah',
      initial_assessment: 'Patient arrived with tense demeanor, accompanied by wife.',
      reported_symptoms: 'Heaviness in chest, frequent nightmares of black animals.',
      medical_history_checked: 'Neurological workup verified negative for organic epilepsy.',
      quranic_verses_recited: [
        'Surah Al-Fatihah (7 times)',
        'Ayat al-Kursi (Al-Baqarah: 255)',
        'Al-Baqarah 102',
        'Al-A\\'raf 117-122',
        'Mu\\'awwidhatayn'
      ],
      authentic_supplications: [
        'Adhhibil-ba\\'sa Rabban-naas...',
        'Bismillahi arqeeka...'
      ],
      observed_reactions: [
        'Trembling in right arm during Al-Baqarah 102',
        'Deep repeated yawning',
        'Cold sweating'
      ],
      raqi_observations: 'Marked physical sensitivity to verses nullifying sorcery. Mental faculties fully intact.',
      professional_assessment: 'Strong presentation consistent with suspected spiritual affliction (Hasad/Sihr). Positive initial response to Duas.',
      assessment_category: 'Spiritual Affliction Suspected (Hasad/Evil Eye)',
      prescribed_remedies: [
        'Ruqyah water: drink morning empty stomach',
        'Ruqyah water bath with 7 crushed green Sidr leaves (7 days)',
        'Recited Olive oil massage on chest and limbs',
        'Morning & Evening Adhkar adherence'
      ],
      recommendations: 'Perform 5 daily prayers in congregation. Avoid occult talismans.',
      next_followup_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    };

    const res = await request('POST', '/api/admin/sessions', sessionPayload);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.data.success, true);
    assert(res.data.session_id.startsWith('RS-'));
    recordedSessionId = res.data.session_id;
  });`;

const newSessionTest = `  // 11. Ruqyah Diagnosis & Session Recording
  let recordedSessionId = '';
  await test('Ruqyah Session Recording: verses, reactions, Raqi professional assessment', async () => {
    const sessionPayload = {
      patient_id: testPatientId,
      session_date: new Date().toISOString().split('T')[0],
      raqi_name: 'Muhammadullah Miah',
      initial_assessment: 'Patient arrived with tense demeanor, accompanied by wife.',
      reported_symptoms: 'Heaviness in chest, frequent nightmares of black animals.',
      patient_main_symptoms: 'মাথা ঘোরা ও সার্বক্ষণিক তীব্র অবসাদ',
      medical_history_checked: 'Neurological workup verified negative for organic epilepsy.',
      observed_reactions: [
        'Trembling / involuntary shivering in limbs',
        'Deep repeated yawning',
        'Profuse cold sweating'
      ],
      physical_observations: 'তিলাওয়াত চলাকালীন ডান হাতে কাঁপুনি ও বারবার দীর্ঘ হাই তোলার প্রবণতা লক্ষণীয়।',
      manual_diagnosis: ['আইন (Ayn)', 'সেহের (Sihr)'],
      assessment_category: 'আইন (Ayn), সেহের (Sihr)',
      prescribed_amal: 'প্রতিদিন সকালে ৭টি আজওয়া খেজুর, পড়া পানি পান, বরই পাতা দিয়ে গোসল এবং সকাল-সন্ধ্যার মাসনূন আজকার পাঠ।',
      raqi_comments: 'রোগীর মধ্যে বদনজর ও সিহরের প্রভাব স্পষ্ট। তবে মানসিক সচেতনতা অটুট। নিয়মিত সুন্নাহ আমল অব্যাহত রাখতে হবে।',
      special_advice: 'পাঁচ ওয়াক্ত সালাত জামাতে আদায়, গান-বাজনা বর্জন, ঘরে সূরা আল-বাকারাহ তিলাওয়াত এবং সবধরনের তাবিয পরিহার।',
      next_followup_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    };

    const res = await request('POST', '/api/admin/sessions', sessionPayload);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.data.success, true);
    assert(res.data.session_id.startsWith('RS-'));
    recordedSessionId = res.data.session_id;

    // Verify session data persistence via GET
    const getRes = await request('GET', \`/api/admin/sessions/\${recordedSessionId}\`);
    assert.strictEqual(getRes.statusCode, 200);
    assert.strictEqual(getRes.data.success, true);
    assert(getRes.data.data.patient_main_symptoms.includes('মাথা ঘোরা'));
    assert(getRes.data.data.prescribed_amal.includes('আজওয়া খেজুর'));
    assert(getRes.data.data.raqi_comments.includes('বদনজর'));
    assert(getRes.data.data.special_advice.includes('সালাত জামাতে আদায়'));
  });`;

content = content.replace(oldSessionTest, newSessionTest);

// 2. Update category assertions from 9 to 10
const oldCat9Block = `  // ==============================================================
  // 15. THE 9 DIAGNOSIS CATEGORIES & APPROVED CLINICAL DATASET
  // ==============================================================
  await test('CRITICAL REQUIREMENT: Exactly 9 diagnosis categories exist in DB', async () => {
    const res = await request('GET', '/api/admin/diagnosis/categories');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.length, 9, 'Must have exactly 9 diagnosis categories');
    
    // Check Bengali Unicode names for all 9 approved categories
    const expectedCodes = [
      'main_complaints', 'physical_symptoms', 'sleep_problems', 'dream_problems',
      'rizq_obstacles', 'mental_behavioral', 'worship_obstacles', 'onset_history', 'family_social'
    ];
    res.data.data.forEach((cat, idx) => {
      assert(cat.name_bn && cat.name_bn.length > 3, \`Category \${idx+1} must have valid Bengali name\`);
      assert(cat.name_en && cat.name_en.length > 3, \`Category \${idx+1} must have valid English name\`);
      assert(expectedCodes.includes(cat.code), \`Category code \${cat.code} must match approved dataset\`);
    });
  });

  await test('CRITICAL CORRECTION: At least 10 active items per category = 92 items total', async () => {
    const res = await request('GET', '/api/admin/diagnosis/categories');
    assert.strictEqual(res.statusCode, 200);

    let totalSymptoms = 0;
    res.data.data.forEach((cat, idx) => {
      const symCount = cat.symptoms.length;
      assert(symCount >= 10, \`Category \${cat.name_bn} (#\${idx+1}) must contain AT LEAST 10 items, got: \${symCount}\`);
      totalSymptoms += symCount;
      
      // Verify every symptom has bilingual labels and sort order
      cat.symptoms.forEach(s => {
        assert(s.symptom_bn && s.symptom_bn.length > 3, 'Symptom must have detailed Bengali text');
        assert(s.symptom_en && s.symptom_en.length > 3, 'Symptom must have English text');
        assert.strictEqual(s.status, 'active');
      });
    });

    assert.strictEqual(totalSymptoms, 92, 'Total active items across all 9 categories must be 92');
  });

  await test('VERIFICATION: No 5-symptom limitation or truncation exists in diagnosis API', async () => {
    const res = await request('GET', '/api/admin/diagnosis/categories');
    assert.strictEqual(res.statusCode, 200);
    res.data.data.forEach(cat => {
      assert(cat.symptoms.length >= 10, \`Category \${cat.name_bn} must have >= 10 symptoms (found: \${cat.symptoms.length})\`);
    });
  });

  await test('Patient Diagnosis: Save multi-selection symptoms across categories with Bengali summary and custom notes', async () => {
    const catRes = await request('GET', '/api/admin/diagnosis/categories');
    const cat1 = catRes.data.data[0];
    const cat2 = catRes.data.data[1];
    const cat6 = catRes.data.data[5]; // Category 6: mental_behavioral (has suicidal thoughts item)`;

const newCat10Block = `  // ==============================================================
  // 15. THE 10 DIAGNOSIS CATEGORIES & APPROVED CLINICAL DATASET
  // ==============================================================
  await test('CRITICAL REQUIREMENT: Exactly 10 diagnosis categories exist in DB', async () => {
    const res = await request('GET', '/api/admin/diagnosis/categories');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.length, 10, 'Must have exactly 10 diagnosis categories');
    
    // Check Bengali Unicode names for all 10 approved categories
    const expectedCodes = [
      'patient_main_symptoms', 'main_complaints', 'physical_symptoms', 'sleep_problems', 'dream_problems',
      'rizq_obstacles', 'mental_behavioral', 'worship_obstacles', 'onset_history', 'family_social'
    ];
    res.data.data.forEach((cat, idx) => {
      assert(cat.name_bn && cat.name_bn.length > 3, \`Category \${idx+1} must have valid Bengali name\`);
      assert(cat.name_en && cat.name_en.length > 3, \`Category \${idx+1} must have valid English name\`);
      assert(expectedCodes.includes(cat.code), \`Category code \${cat.code} must match approved dataset\`);
    });

    // Category 1 is patient_main_symptoms with 0 predefined checkboxes
    const cat1 = res.data.data[0];
    assert.strictEqual(cat1.code, 'patient_main_symptoms');
    assert.strictEqual(cat1.name_bn, 'রোগীর প্রধান উপসর্গসমূহ');
    assert.strictEqual(cat1.symptoms.length, 0, 'Category 1 must contain ONLY textarea for main symptoms (0 predefined checkboxes)');
  });

  await test('CRITICAL CORRECTION: At least 10 active items per category for categories 2-10 = 92 items total', async () => {
    const res = await request('GET', '/api/admin/diagnosis/categories');
    assert.strictEqual(res.statusCode, 200);

    let totalSymptoms = 0;
    const symptomCategories = res.data.data.filter(c => c.code !== 'patient_main_symptoms');
    assert.strictEqual(symptomCategories.length, 9, 'Must have 9 categories containing selectable symptoms');

    symptomCategories.forEach((cat, idx) => {
      const symCount = cat.symptoms.length;
      assert(symCount >= 10, \`Category \${cat.name_bn} (#\${idx+2}) must contain AT LEAST 10 items, got: \${symCount}\`);
      totalSymptoms += symCount;
      
      // Verify every symptom has bilingual labels and sort order
      cat.symptoms.forEach(s => {
        assert(s.symptom_bn && s.symptom_bn.length > 3, 'Symptom must have detailed Bengali text');
        assert(s.symptom_en && s.symptom_en.length > 3, 'Symptom must have English text');
        assert.strictEqual(s.status, 'active');
      });
    });

    assert.strictEqual(totalSymptoms, 92, 'Total active items across categories 2-10 must be 92');
  });

  await test('VERIFICATION: No 5-symptom limitation or truncation exists in diagnosis API', async () => {
    const res = await request('GET', '/api/admin/diagnosis/categories');
    assert.strictEqual(res.statusCode, 200);
    const symptomCategories = res.data.data.filter(c => c.code !== 'patient_main_symptoms');
    symptomCategories.forEach(cat => {
      assert(cat.symptoms.length >= 10, \`Category \${cat.name_bn} must have >= 10 symptoms (found: \${cat.symptoms.length})\`);
    });
  });

  await test('Patient Diagnosis: Save multi-selection symptoms across categories with Bengali summary and custom notes', async () => {
    const catRes = await request('GET', '/api/admin/diagnosis/categories');
    const cat1 = catRes.data.data.find(c => c.code === 'main_complaints');
    const cat2 = catRes.data.data.find(c => c.code === 'physical_symptoms');
    const cat6 = catRes.data.data.find(c => c.code === 'mental_behavioral'); // has suicidal thoughts item`;

content = content.replace(oldCat9Block, newCat10Block);

// 3. Update cat3 in Patient Diagnosis edit test
content = content.replace(
  "const cat3 = catRes.data.data[2];",
  "const cat3 = catRes.data.data.find(c => c.code === 'sleep_problems');"
);

// 4. Update Public Diagnosis API test
const oldPublicDiag = `  await test('Public Diagnosis API: Returns all 9 active categories and 10 symptoms each', async () => {
    const res = await request('GET', '/api/public/diagnosis/categories');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.length, 9);
    let symCount = 0;
    res.data.data.forEach(c => symCount += c.symptoms.length);
    assert.strictEqual(symCount, 92);
  });`;

const newPublicDiag = `  await test('Public Diagnosis API: Returns all 10 active categories and 92 symptoms total', async () => {
    const res = await request('GET', '/api/public/diagnosis/categories');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.length, 10);
    let symCount = 0;
    res.data.data.forEach(c => symCount += c.symptoms.length);
    assert.strictEqual(symCount, 92);
  });`;

content = content.replace(oldPublicDiag, newPublicDiag);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated system.test.js');
