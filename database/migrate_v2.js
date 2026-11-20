/**
 * Migration Script V2:
 * 1. Adds service_type, service_price, appointment_time, notes columns to appointments table (if not exists)
 * 2. Adds problem_duration, previous_treatment_history, rizq_family_situation, genetic_history to patient_histories (if not exists)
 * 3. Deactivates old multiple Ruqyah packages while preserving historical appointments
 * 4. Adds/Updates single Ruqyah service (2050 BDT) and Hijama service (consultation-based)
 */

const db = require('./db');

function runMigration() {
  console.log('Running Database Migration V2...');

  // 1. Alter appointments table
  const aptCols = db.prepare("PRAGMA table_info(appointments)").all().map(c => c.name);
  
  if (!aptCols.includes('service_type')) {
    db.prepare("ALTER TABLE appointments ADD COLUMN service_type TEXT DEFAULT 'ruqyah'").run();
    console.log('Added service_type column to appointments.');
  }
  if (!aptCols.includes('service_price')) {
    db.prepare("ALTER TABLE appointments ADD COLUMN service_price REAL DEFAULT 2050").run();
    console.log('Added service_price column to appointments.');
  }
  if (!aptCols.includes('appointment_time')) {
    db.prepare("ALTER TABLE appointments ADD COLUMN appointment_time TEXT").run();
    console.log('Added appointment_time column to appointments.');
  }
  if (!aptCols.includes('notes')) {
    db.prepare("ALTER TABLE appointments ADD COLUMN notes TEXT").run();
    console.log('Added notes column to appointments.');
  }

  // Populate appointment_time & notes from existing columns if empty
  db.prepare("UPDATE appointments SET appointment_time = time_slot WHERE appointment_time IS NULL").run();
  db.prepare("UPDATE appointments SET notes = additional_notes WHERE notes IS NULL").run();

  // 2. Alter patient_histories table
  const histCols = db.prepare("PRAGMA table_info(patient_histories)").all().map(c => c.name);

  if (!histCols.includes('problem_duration')) {
    db.prepare("ALTER TABLE patient_histories ADD COLUMN problem_duration TEXT").run();
    console.log('Added problem_duration column to patient_histories.');
  }
  if (!histCols.includes('previous_treatment_history')) {
    db.prepare("ALTER TABLE patient_histories ADD COLUMN previous_treatment_history TEXT").run();
    console.log('Added previous_treatment_history column to patient_histories.');
  }
  if (!histCols.includes('rizq_family_situation')) {
    db.prepare("ALTER TABLE patient_histories ADD COLUMN rizq_family_situation TEXT").run();
    console.log('Added rizq_family_situation column to patient_histories.');
  }
  if (!histCols.includes('genetic_history')) {
    db.prepare("ALTER TABLE patient_histories ADD COLUMN genetic_history TEXT").run();
    console.log('Added genetic_history column to patient_histories.');
  }

  // Sync existing duration_of_problems to problem_duration if empty
  db.prepare("UPDATE patient_histories SET problem_duration = duration_of_problems WHERE problem_duration IS NULL").run();
  db.prepare("UPDATE patient_histories SET rizq_family_situation = financial_family_situation WHERE rizq_family_situation IS NULL").run();

  // 3. Update Services Table: Deactivate all old packages without deleting them
  db.prepare("UPDATE services SET is_active = 0").run();
  console.log('Deactivated all old package systems.');

  // 4. Ensure the canonical 2 services exist and are active:
  // Service 1: Ruqyah (রুকইয়াহ) - 2050 BDT
  const ruqyahExists = db.prepare("SELECT id FROM services WHERE code = 'ruqyah'").get();
  if (ruqyahExists) {
    db.prepare(`
      UPDATE services
      SET name = 'রুকইয়াহ',
          category = 'ruqyah',
          description = 'রুকইয়াহ ডায়াগনোসিস, কনসালটেন্ট ফি এবং প্রাথমিক ট্রিটমেন্টসহ: ২,০৫০ টাকা',
          duration_minutes = 60,
          price = 2050,
          discount_price = NULL,
          is_active = 1,
          display_order = 1
      WHERE id = ?
    `).run(ruqyahExists.id);
  } else {
    db.prepare(`
      INSERT INTO services (code, name, category, description, duration_minutes, price, discount_price, is_active, display_order)
      VALUES ('ruqyah', 'রুকইয়াহ', 'ruqyah', 'রুকইয়াহ ডায়াগনোসিস, কনসালটেন্ট ফি এবং প্রাথমিক ট্রিটমেন্টসহ: ২,০৫০ টাকা', 60, 2050, NULL, 1, 1)
    `).run();
  }

  // Service 2: Hijama (হিজামা) - Consultation-based price (0 / NULL)
  const hijamaExists = db.prepare("SELECT id FROM services WHERE code = 'hijama'").get();
  if (hijamaExists) {
    db.prepare(`
      UPDATE services
      SET name = 'হিজামা',
          category = 'hijama',
          description = 'খরচ পরামর্শের মাধ্যমে নির্ধারণ করা হবে।',
          duration_minutes = 60,
          price = 0,
          discount_price = NULL,
          is_active = 1,
          display_order = 2
      WHERE id = ?
    `).run(hijamaExists.id);
  } else {
    db.prepare(`
      INSERT INTO services (code, name, category, description, duration_minutes, price, discount_price, is_active, display_order)
      VALUES ('hijama', 'হিজামা', 'hijama', 'খরচ পরামর্শের মাধ্যমে নির্ধারণ করা হবে।', 60, 0, NULL, 1, 2)
    `).run();
  }

  console.log('Configured canonical active services:');
  const activeServices = db.prepare("SELECT id, code, name, price, description, is_active FROM services WHERE is_active = 1").all();
  console.log(activeServices);

  console.log('Migration V2 completed successfully!');
}

runMigration();
