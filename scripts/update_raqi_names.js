const db = require('../database/db');

console.log('--- Updating Raqi names in DB ---');

const updateArticles = db.prepare(`
  UPDATE articles 
  SET author_name = 'মুহাম্মদুল্লাহ মিয়াহ (Muhammadullah Miah)' 
  WHERE author_name LIKE '%মিয়াজী%' OR author_name LIKE '%Miyah%'
`).run();
console.log('Updated articles:', updateArticles.changes);

const updateDiagnoses = db.prepare(`
  UPDATE patient_diagnoses 
  SET raqi_name = 'মুহাম্মদুল্লাহ মিয়াহ' 
  WHERE raqi_name LIKE '%মিয়াজী%' OR raqi_name LIKE '%মুহাম্মদ উল্লাহ%'
`).run();
console.log('Updated patient_diagnoses:', updateDiagnoses.changes);

const updateSessions = db.prepare(`
  UPDATE ruqyah_sessions 
  SET raqi_name = 'Muhammadullah Miah' 
  WHERE raqi_name LIKE '%Miyah%' OR raqi_name LIKE '%মিয়াজী%' OR raqi_name = 'মুহাম্মদুল্লাহ মিয়া'
`).run();
console.log('Updated ruqyah_sessions:', updateSessions.changes);

const updateSettings = db.prepare(`
  UPDATE clinic_settings 
  SET raqi_name = 'Muhammadullah Miah' 
  WHERE id = 1
`).run();
console.log('Updated clinic_settings:', updateSettings.changes);

console.log('Verification:');
console.log('articles:', db.prepare('SELECT id, author_name FROM articles').all());
console.log('settings:', db.prepare('SELECT id, raqi_name FROM clinic_settings').all());
console.log('diagnoses:', db.prepare('SELECT id, raqi_name FROM patient_diagnoses LIMIT 3').all());
console.log('sessions:', db.prepare('SELECT id, raqi_name FROM ruqyah_sessions LIMIT 3').all());
