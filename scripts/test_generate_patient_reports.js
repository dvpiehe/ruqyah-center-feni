const fs = require('fs');
const path = require('path');
const pdfGen = require('../utils/pdfGenerator');
const db = require('../database/db');

function extractJpegFromPdf(pdfBuf) {
  const startMarker = Buffer.from('/Filter /DCTDecode /Length ');
  const startIdx = pdfBuf.indexOf(startMarker);
  if (startIdx === -1) return null;
  const streamMarker = Buffer.from('stream\n');
  const streamIdx = pdfBuf.indexOf(streamMarker, startIdx);
  const endMarker = Buffer.from('\nendstream');
  const endIdx = pdfBuf.indexOf(endMarker, streamIdx);
  return pdfBuf.slice(streamIdx + streamMarker.length, endIdx);
}

async function run() {
  const patientId = 'RSCC-P-1104';
  const patient = db.prepare('SELECT * FROM patients WHERE patient_id = ?').get(patientId);
  const history = db.prepare('SELECT * FROM patient_histories WHERE patient_id = ?').get(patientId);
  const diagnosis = db.prepare('SELECT * FROM patient_diagnoses WHERE patient_id = ? ORDER BY id DESC LIMIT 1').get(patientId);
  const session = db.prepare('SELECT * FROM ruqyah_sessions LIMIT 1').get();

  // 1. Patient History PDF in Bengali
  console.log('Generating Patient History PDF (Bengali)...');
  const bnHistPdf = await pdfGen.generatePatientHistoryPdf(patient, history, diagnosis, 'bn');
  fs.writeFileSync('scratch/patient_history_bn.pdf', bnHistPdf);
  const bnHistJpg = extractJpegFromPdf(bnHistPdf);
  if (bnHistJpg) {
    fs.writeFileSync('scratch/patient_history_bn.jpg', bnHistJpg);
    console.log('Saved scratch/patient_history_bn.jpg (size:', bnHistJpg.length, ')');
  }

  // 2. Patient History PDF in English
  console.log('Generating Patient History PDF (English)...');
  const enHistPdf = await pdfGen.generatePatientHistoryPdf(patient, history, diagnosis, 'en');
  fs.writeFileSync('scratch/patient_history_en.pdf', enHistPdf);
  const enHistJpg = extractJpegFromPdf(enHistPdf);
  if (enHistJpg) {
    fs.writeFileSync('scratch/patient_history_en.jpg', enHistJpg);
    console.log('Saved scratch/patient_history_en.jpg (size:', enHistJpg.length, ')');
  }

  // 3. Ruqyah Session PDF in Bengali
  console.log('Generating Ruqyah Session PDF (Bengali)...');
  const bnSessPdf = await pdfGen.generateRuqyahSessionPdf(session, patient, 'bn');
  fs.writeFileSync('scratch/session_report_bn.pdf', bnSessPdf);
  const bnSessJpg = extractJpegFromPdf(bnSessPdf);
  if (bnSessJpg) {
    fs.writeFileSync('scratch/session_report_bn.jpg', bnSessJpg);
    console.log('Saved scratch/session_report_bn.jpg (size:', bnSessJpg.length, ')');
  }

  // 4. Ruqyah Session PDF in English
  console.log('Generating Ruqyah Session PDF (English)...');
  const enSessPdf = await pdfGen.generateRuqyahSessionPdf(session, patient, 'en');
  fs.writeFileSync('scratch/session_report_en.pdf', enSessPdf);
  const enSessJpg = extractJpegFromPdf(enSessPdf);
  if (enSessJpg) {
    fs.writeFileSync('scratch/session_report_en.jpg', enSessJpg);
    console.log('Saved scratch/session_report_en.jpg (size:', enSessJpg.length, ')');
  }

  console.log('All reports generated and extracted successfully!');
}

run().catch(console.error);
