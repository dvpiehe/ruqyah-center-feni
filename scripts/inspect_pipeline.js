const db = require('../database/db');

console.log('=== Tables ===');
console.log(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name));

console.log('\n=== patient_diagnoses columns ===');
console.log(db.prepare('PRAGMA table_info(patient_diagnoses)').all().map(c => `${c.name} (${c.type})`));

console.log('\n=== patient_histories columns ===');
console.log(db.prepare('PRAGMA table_info(patient_histories)').all().map(c => `${c.name} (${c.type})`));

console.log('\n=== Sample patient_diagnoses ===');
const diagnoses = db.prepare('SELECT * FROM patient_diagnoses LIMIT 3').all();
console.log(diagnoses.map(d => ({
  id: d.id,
  patient_id: d.patient_id,
  category_ids: d.category_ids,
  selected_symptom_ids: d.selected_symptom_ids,
  selected_symptoms_json: d.selected_symptoms_json ? d.selected_symptoms_json.slice(0, 150) + '...' : null
})));

console.log('\n=== All patient_diagnoses count ===', db.prepare('SELECT COUNT(*) as count FROM patient_diagnoses').get().count);
console.log('=== All patient_histories count ===', db.prepare('SELECT COUNT(*) as count FROM patient_histories').get().count);
console.log('=== All patients count ===', db.prepare('SELECT COUNT(*) as count FROM patients').get().count);
