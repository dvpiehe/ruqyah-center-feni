const pdfGen = require('../utils/pdfGenerator');
const db = require('../database/db');

async function run() {
  const patient = db.prepare('SELECT * FROM patients LIMIT 1').get();
  const history = db.prepare('SELECT * FROM patient_histories WHERE patient_id = ?').get(patient.patient_id);
  const diagnosis = db.prepare('SELECT * FROM patient_diagnoses WHERE patient_id = ? ORDER BY id DESC LIMIT 1').get(patient.patient_id);
  const session = db.prepare('SELECT * FROM ruqyah_sessions LIMIT 1').get();

  console.log('Testing Patient History PDF (BN)...');
  const bnHistPdf = await pdfGen.generatePatientHistoryPdf(patient, history, diagnosis, 'bn');
  console.log('BN Hist PDF size:', bnHistPdf.length);

  console.log('Testing Patient History PDF (EN)...');
  const enHistPdf = await pdfGen.generatePatientHistoryPdf(patient, history, diagnosis, 'en');
  console.log('EN Hist PDF size:', enHistPdf.length);

  console.log('Testing Ruqyah Session PDF (BN)...');
  const bnSessPdf = await pdfGen.generateRuqyahSessionPdf(session, patient, 'bn');
  console.log('BN Sess PDF size:', bnSessPdf.length);

  console.log('Testing Ruqyah Session PDF (EN)...');
  const enSessPdf = await pdfGen.generateRuqyahSessionPdf(session, patient, 'en');
  console.log('EN Sess PDF size:', enSessPdf.length);

  console.log('All 4 PDFs generated successfully!');
}

run().catch(console.error);
