/**
 * Database Migration v6: Ruqyah Session Fields & 10th Category Update
 */

const db = require('./db');

console.log('=== Starting Database Migration v6 ===');

const runMigration = db.transaction(() => {
  // 1. Add new columns to ruqyah_sessions if they don't already exist
  const sessionTableInfo = db.prepare('PRAGMA table_info(ruqyah_sessions)').all();
  const existingCols = new Set(sessionTableInfo.map(c => c.name));

  const newColumns = [
    { name: 'manual_diagnosis', type: 'TEXT' },
    { name: 'prescribed_amal', type: 'TEXT' },
    { name: 'raqi_comments', type: 'TEXT' },
    { name: 'special_advice', type: 'TEXT' },
    { name: 'physical_observations', type: 'TEXT' },
    { name: 'patient_main_symptoms', type: 'TEXT' }
  ];

  for (const col of newColumns) {
    if (!existingCols.has(col.name)) {
      console.log(`Adding column ${col.name} (${col.type}) to ruqyah_sessions...`);
      db.prepare(`ALTER TABLE ruqyah_sessions ADD COLUMN ${col.name} ${col.type}`).run();
    } else {
      console.log(`Column ${col.name} already exists in ruqyah_sessions.`);
    }
  }

  // 2. Manage 10 Categories:
  // Check if 'patient_main_symptoms' category exists
  const existingNewCat = db.prepare('SELECT id FROM diagnosis_categories WHERE code = ?').get('patient_main_symptoms');

  if (!existingNewCat) {
    console.log('Inserting new Category 1: "রোগীর প্রধান উপসর্গসমূহ" (Patient\'s Main Symptoms)...');
    
    // Shift all existing categories up by 1 (sort orders become 2 to 10)
    db.prepare('UPDATE diagnosis_categories SET sort_order = sort_order + 1').run();

    // Insert new category at sort_order = 1
    db.prepare(`
      INSERT INTO diagnosis_categories (
        code, name_bn, name_en, description_bn, description_en, sort_order, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'patient_main_symptoms',
      'রোগীর প্রধান উপসর্গসমূহ',
      "Patient's Main Symptoms",
      'রোগীর প্রধান প্রধান উপসর্গ ও অভিযোগসমূহ (ম্যানুয়াল বিবরণী)',
      "Patient's primary presenting symptoms and complaints (manual entry)",
      1,
      'active'
    );
    console.log('Category 1 inserted successfully.');
  } else {
    console.log('Category "patient_main_symptoms" already exists.');
  }

  // Normalize raqi_name defaults if needed
  db.prepare(`UPDATE ruqyah_sessions SET raqi_name = 'Muhammadullah Miah' WHERE raqi_name LIKE '%Miyah%'`).run();
  db.prepare(`UPDATE patient_diagnoses SET raqi_name = 'মুহাম্মদুল্লাহ মিয়া' WHERE raqi_name LIKE '%মিয়াজী%' OR raqi_name LIKE '%মিয়াহ%'`).run();
});

try {
  runMigration();
  console.log('=== Migration v6 Completed Successfully ===');

  const catCount = db.prepare('SELECT count(*) as count FROM diagnosis_categories').get().count;
  const symCount = db.prepare('SELECT count(*) as count FROM diagnosis_symptoms').get().count;
  console.log(`Total Categories: ${catCount}`);
  console.log(`Total Symptoms: ${symCount}`);
} catch (err) {
  console.error('Migration v6 Failed:', err);
  process.exit(1);
}
