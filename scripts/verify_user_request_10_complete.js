const fs = require('fs');
const path = require('path');
const assert = require('assert');
const db = require('../database/db');
const pdfGen = require('../utils/pdfGenerator');

async function runVerification() {
  console.log('=============================================================');
  console.log(' RUNNING END-TO-END VERIFICATION: RUQYAH SESSION UPDATE');
  console.log('=============================================================');

  // Step 1: Ensure patient exists
  let patient = db.prepare("SELECT * FROM patients WHERE patient_id = 'RSCC-P-1001'").get();
  if (!patient) {
    patient = db.prepare("SELECT * FROM patients LIMIT 1").get();
  }
  assert(patient, 'Patient must exist in database');
  console.log(`Step 1: Using Patient: ${patient.full_name} (${patient.patient_id})`);

  // Step 2-7: Define complete session payload with all new fields
  const sessionData = {
    patient_id: patient.patient_id,
    session_date: new Date().toISOString().split('T')[0],
    raqi_name: 'মুহাম্মদুল্লাহ মিয়া',
    patient_main_symptoms: 'দীর্ঘস্থায়ী তীব্র মাথাব্যথা, অনিদ্রা ও বুক ভারী লাগা',
    reported_symptoms: 'দীর্ঘস্থায়ী তীব্র মাথাব্যথা, অনিদ্রা ও বুক ভারী লাগা',
    medical_history_checked: 'মস্তিষ্কের সিটি স্ক্যান ও ইসিজি রিপোর্ট স্বাভাবিক। কোনো শারীরিক রোগ ধরা পড়েনি।',
    observed_reactions: JSON.stringify([
      'Trembling / involuntary shivering in limbs',
      'Sudden weeping / tears without grief',
      'Deep repeated yawning'
    ]),
    physical_observations: 'তিলাওয়াত চলাকালীন রোগীর ডান হাত কাঁপছিল এবং প্রচণ্ড কান্নার ভাব হয়েছিল।',
    manual_diagnosis: JSON.stringify(['আইন (Ayn)', 'সেহের (Sihr)']),
    assessment_category: 'আইন (Ayn), সেহের (Sihr)',
    prescribed_amal: 'সকালে খালি পেটে ১ গ্লাস পড়া পানি পান, রাতে জয়তুন তেল মালিশ এবং সকাল-সন্ধ্যার আজকার পাঠ।',
    raqi_comments: 'রোগীর লক্ষণসমূহ সিহর ও বদনজরের সাথে সঙ্গতিপূর্ণ। রুকইয়াহ তিলাওয়াত চলাকালীন স্পষ্ট শারীরিক সংবেদনশীলতা পরিলক্ষিত হয়েছে।',
    special_advice: 'পাঁচ ওয়াক্ত সালাত জামাতে আদায় করা এবং সব ধরনের তাবিয বর্জন করা।',
    next_followup_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'Completed'
  };

  // Step 8: Save the session
  const countRecord = db.prepare('SELECT COUNT(*) as count FROM ruqyah_sessions WHERE patient_id = ?').get(patient.patient_id);
  const sessionNum = countRecord.count + 1;
  const cleanPId = patient.patient_id.replace(/^RSCC-P-/, 'P');
  const sessionId = `RS-${cleanPId}-${String(sessionNum).padStart(2, '0')}`;

  db.prepare(`
    INSERT INTO ruqyah_sessions (
      session_id, patient_id, session_number, session_date, raqi_name,
      patient_main_symptoms, reported_symptoms, medical_history_checked,
      observed_reactions, physical_observations, manual_diagnosis,
      assessment_category, prescribed_amal, raqi_comments, special_advice,
      next_followup_date, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    sessionId, sessionData.patient_id, sessionNum, sessionData.session_date, sessionData.raqi_name,
    sessionData.patient_main_symptoms, sessionData.reported_symptoms, sessionData.medical_history_checked,
    sessionData.observed_reactions, sessionData.physical_observations, sessionData.manual_diagnosis,
    sessionData.assessment_category, sessionData.prescribed_amal, sessionData.raqi_comments, sessionData.special_advice,
    sessionData.next_followup_date, sessionData.status
  );

  console.log(`Step 8: Saved session successfully with ID: ${sessionId}`);

  // Step 9: Reopen session and verify all fields remain intact
  const reopened = db.prepare('SELECT * FROM ruqyah_sessions WHERE session_id = ?').get(sessionId);
  assert(reopened, 'Reopened session must exist');
  assert.strictEqual(reopened.patient_main_symptoms, sessionData.patient_main_symptoms);
  assert.strictEqual(reopened.observed_reactions, sessionData.observed_reactions);
  assert.strictEqual(reopened.physical_observations, sessionData.physical_observations);
  assert.strictEqual(reopened.manual_diagnosis, sessionData.manual_diagnosis);
  assert.strictEqual(reopened.prescribed_amal, sessionData.prescribed_amal);
  assert.strictEqual(reopened.raqi_comments, sessionData.raqi_comments);
  assert.strictEqual(reopened.special_advice, sessionData.special_advice);
  console.log('Step 9: Reopened session and verified all data intact ✓');

  // Step 10: Generate both Bengali and English PDF reports
  console.log('Step 10: Generating Bengali PDF report...');
  const bnPdf = await pdfGen.generateRuqyahSessionPdf(reopened, patient, 'bn');
  assert(bnPdf && bnPdf.length > 5000, 'Bengali PDF must be valid binary buffer');
  console.log(`Generated Bengali PDF (${bnPdf.length} bytes) ✓`);

  console.log('Step 10: Generating English PDF report...');
  const enPdf = await pdfGen.generateRuqyahSessionPdf(reopened, patient, 'en');
  assert(enPdf && enPdf.length > 5000, 'English PDF must be valid binary buffer');
  console.log(`Generated English PDF (${enPdf.length} bytes) ✓`);

  // Save artifacts to scratch and conversation brain
  const artifactDir = 'C:\\Users\\karim\\.gemini\\antigravity\\brain\\a4e5aa21-9f68-43c8-950e-b362cda9b623';
  fs.writeFileSync(path.join(artifactDir, 'new_ruqyah_session_bn.pdf'), bnPdf);
  fs.writeFileSync(path.join(artifactDir, 'new_ruqyah_session_en.pdf'), enPdf);

  // Extract page image from PDF using pdf-poppler or canvas/pdf2pic or sharp
  // We can also extract the embedded JPEG from packJpegToPdf
  function extractJpeg(pdfBuf) {
    const startIdx = pdfBuf.indexOf(Buffer.from([0xFF, 0xD8, 0xFF]));
    const endIdx = pdfBuf.lastIndexOf(Buffer.from([0xFF, 0xD9]));
    if (startIdx !== -1 && endIdx !== -1) {
      return pdfBuf.slice(startIdx, endIdx + 2);
    }
    return null;
  }

  const bnJpeg = extractJpeg(bnPdf);
  const enJpeg = extractJpeg(enPdf);

  if (bnJpeg) fs.writeFileSync(path.join(artifactDir, 'new_ruqyah_session_bn.jpg'), bnJpeg);
  if (enJpeg) fs.writeFileSync(path.join(artifactDir, 'new_ruqyah_session_en.jpg'), enJpeg);

  console.log('Saved inspection artifacts to:', artifactDir);
  console.log('=============================================================');
  console.log(' ALL 10 FINAL VERIFICATION STEPS COMPLETED SUCCESSFULLY! ✓');
  console.log('=============================================================');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
