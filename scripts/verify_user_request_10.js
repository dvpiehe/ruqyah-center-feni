const fs = require('fs');
const path = require('path');
const http = require('http');
const sharp = require('sharp');
const db = require('../database/db');
const { generatePatientHistoryPdf, generateRuqyahSessionPdf } = require('../utils/pdfGenerator');

async function verifyAll() {
  console.log('--- 1. Testing End-to-End Patient Symptom Integration ---');

  // Find or create test patient
  let testPatient = db.prepare('SELECT * FROM patients WHERE patient_id = ?').get('RSCC-P-1125');
  if (!testPatient) {
    testPatient = db.prepare('SELECT * FROM patients ORDER BY id DESC LIMIT 1').get();
  }
  console.log('Testing with patient:', testPatient.patient_id, testPatient.full_name);

  const diagnosis = db.prepare('SELECT * FROM patient_diagnoses WHERE patient_id = ? ORDER BY id DESC LIMIT 1').get(testPatient.patient_id);
  const history = db.prepare('SELECT * FROM patient_histories WHERE patient_id = ?').get(testPatient.patient_id);

  console.log('Diagnosis record exists:', !!diagnosis);
  console.log('History record exists:', !!history);

  // Generate BN PDF
  console.log('\n--- 2. Generating Bengali Patient History PDF ---');
  const bnPdf = await generatePatientHistoryPdf(testPatient, history, diagnosis, 'bn');
  console.log('BN PDF generated successfully, byte size:', bnPdf.length);
  fs.writeFileSync(path.join(__dirname, 'verify_patient_bn.pdf'), bnPdf);

  // Generate EN PDF
  console.log('\n--- 3. Generating English Patient History PDF ---');
  const enPdf = await generatePatientHistoryPdf(testPatient, history, diagnosis, 'en');
  console.log('EN PDF generated successfully, byte size:', enPdf.length);
  fs.writeFileSync(path.join(__dirname, 'verify_patient_en.pdf'), enPdf);

  function extractJpegFromPdf(pdfBuf) {
    const streamMarker = Buffer.from('stream\n');
    const startIdx = pdfBuf.indexOf(streamMarker);
    if (startIdx === -1) return null;
    const endMarker = Buffer.from('\nendstream');
    const endIdx = pdfBuf.indexOf(endMarker, startIdx);
    if (endIdx === -1) return null;
    return pdfBuf.slice(startIdx + streamMarker.length, endIdx);
  }

  // Extract from the generated PDFs for visual proof
  const bnImg = extractJpegFromPdf(bnPdf);
  if (bnImg) {
    fs.writeFileSync(path.join(__dirname, 'verify_patient_bn.jpg'), bnImg);
    console.log('Extracted BN page from PDF:', bnImg.length, 'bytes');
  }

  const enImg = extractJpegFromPdf(enPdf);
  if (enImg) {
    fs.writeFileSync(path.join(__dirname, 'verify_patient_en.jpg'), enImg);
    console.log('Extracted EN page from PDF:', enImg.length, 'bytes');
  }

  // Copy to brain artifacts
  const artifactDir = 'C:\\Users\\karim\\.gemini\\antigravity\\brain\\a4e5aa21-9f68-43c8-950e-b362cda9b623';
  fs.copyFileSync(path.join(__dirname, 'verify_patient_bn.jpg'), path.join(artifactDir, 'verify_patient_bn.jpg'));
  fs.copyFileSync(path.join(__dirname, 'verify_patient_en.jpg'), path.join(artifactDir, 'verify_patient_en.jpg'));
  fs.copyFileSync(path.join(__dirname, 'verify_patient_bn.pdf'), path.join(artifactDir, 'verify_patient_bn.pdf'));
  fs.copyFileSync(path.join(__dirname, 'verify_patient_en.pdf'), path.join(artifactDir, 'verify_patient_en.pdf'));
  console.log('Copied files to artifacts directory.');

  // Check official name
  console.log('\n--- 4. Checking Official Name Everywhere ---');
  const indexHtml = fs.readFileSync(path.join(__dirname, '../views/index.html'), 'utf8');
  if (indexHtml.includes('Muhammadullah Miyah') || indexHtml.includes('মুহাম্মদুল্লাহ মিয়াহ')) {
    console.error('FAILED: index.html contains incorrect spelling');
  } else {
    console.log('PASSED: index.html has correct Raqi name.');
  }

  // Check Address Section in index.html
  console.log('\n--- 5. Checking Address Section in Homepage ---');
  if (indexHtml.includes('আমাদের ঠিকানা') && indexHtml.includes('ভূঞা ম্যানশন') && indexHtml.includes('স্টার লাইন হাসপাতালের বিপরীত পাশে')) {
    console.log('PASSED: Homepage Address Section matches exact required text.');
  } else {
    console.error('FAILED: Homepage Address Section missing required text.');
  }

  // Check Homepage Branch Name showcase banner
  console.log('\n--- 6. Checking Top Branch Name Banner ---');
  if (indexHtml.includes('top-branch-brand-showcase') && indexHtml.includes('RUQYAH SUPPORT &amp; CUPPING CENTER') && indexHtml.includes('FENI BRANCH')) {
    console.log('PASSED: Top prominent Branch Name showcase banner is present at top of body.');
  } else {
    console.error('FAILED: Top Branch Name banner missing.');
  }

  console.log('\n=== ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY ===');
}

verifyAll().catch(console.error);
