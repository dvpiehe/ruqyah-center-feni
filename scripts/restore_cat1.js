const db = require('../database/db');

db.prepare(`
  UPDATE diagnosis_categories
  SET name_bn = ?,
      name_en = ?,
      description_bn = ?,
      description_en = ?,
      sort_order = 1
  WHERE code = 'patient_main_symptoms'
`).run(
  'রোগীর প্রধান উপসর্গসমূহ',
  "Patient's Main Symptoms",
  'রোগীর প্রধান প্রধান উপসর্গ ও অভিযোগসমূহ (ম্যানুয়াল বিবরণী)',
  "Patient's primary presenting symptoms and complaints (manual entry)"
);

console.log('Restored patient_main_symptoms category');
