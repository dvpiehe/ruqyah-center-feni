const bcrypt = require('bcryptjs');
const db = require('./db');
const { CLINIC } = require('../config/constants');

function seed() {
  console.log('Seeding Ruqyah Support & Cupping Center database...');

  // 1. Admin account
  const adminExists = db.prepare('SELECT id FROM administrators WHERE username = ?').get('admin');
  if (!adminExists) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('Admin@12345', salt);
    db.prepare(`
      INSERT INTO administrators (username, password_hash, name, email, role)
      VALUES (?, ?, ?, ?, ?)
    `).run('admin', passwordHash, 'Muhammadullah Miah', 'admin@ruqyahsupport-feni.com', 'superadmin');
    console.log('Created default admin: admin / Admin@12345');
  }

  // 2. Clinic settings
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM clinic_settings').get().count;
  if (settingsCount === 0) {
    db.prepare(`
      INSERT INTO clinic_settings (id, business_name, branch_name, raqi_name, phone, whatsapp, address, email, hours, emergency_notes)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      CLINIC.NAME,
      CLINIC.BRANCH,
      CLINIC.LEAD_RAQI,
      CLINIC.PHONE,
      CLINIC.WHATSAPP,
      CLINIC.ADDRESS,
      CLINIC.EMAIL,
      'Saturday to Thursday: 09:00 AM – 08:00 PM (Break: 01:00 PM – 02:00 PM)\nFriday: Closed / By Prior Appointment',
      'For emergency severe cases, please call directly prior to visiting.'
    );
    console.log('Created default clinic settings.');
  }

  // 3. Availability settings
  const availCount = db.prepare('SELECT COUNT(*) as count FROM availability_settings').get().count;
  if (availCount === 0) {
    db.prepare(`
      INSERT INTO availability_settings (id, weekly_holiday_day, slot_duration_minutes, break_start, break_end, opening_time, closing_time)
      VALUES (1, 5, 60, '13:00', '14:00', '09:00', '20:00')
    `).run();
    console.log('Created default availability settings.');
  }

  // 4. Default Services
  const servicesCount = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
  if (servicesCount === 0) {
    const defaultServices = [
      {
        code: 'ruqyah-diag-initial',
        name: 'Ruqyah Shariah Diagnosis & Initial Treatment',
        category: 'ruqyah',
        description: 'Comprehensive 1-on-1 assessment, Qur’anic diagnosis recitation, spiritual evaluation, and initial treatment session by Raqi Muhammadullah Miah.',
        duration_minutes: 60,
        price: 1500,
        discount_price: null,
        display_order: 1
      },
      {
        code: 'ruqyah-followup',
        name: 'Ruqyah Shariah Follow-up Session',
        category: 'ruqyah',
        description: 'Progression review, dedicated recitation session, monitoring of reaction changes, and updated therapeutic guidance.',
        duration_minutes: 60,
        price: 1000,
        discount_price: null,
        display_order: 2
      },
      {
        code: 'hijama-sunnah',
        name: 'Sunnah Hijama (Full Body Cupping Therapy)',
        category: 'hijama',
        description: 'Hygienic Sunnah wet cupping performed at recommended prophetic anatomical points. Certified male and female therapists available.',
        duration_minutes: 60,
        price: 1200,
        discount_price: 1000,
        display_order: 3
      },
      {
        code: 'hijama-back',
        name: 'Back Hijama Therapy',
        category: 'hijama',
        description: 'Targeted cupping therapy focused on upper and lower back points to alleviate chronic tension, spasms, and localized lethargy.',
        duration_minutes: 60,
        price: 800,
        discount_price: null,
        display_order: 4
      },
      {
        code: 'hijama-head',
        name: 'Head Hijama (Sunnah Al-Yafookh & Kahil)',
        category: 'hijama',
        description: 'Specialized prophetic head cupping for persistent migraines, chronic heaviness, brain fog, and psychological relief.',
        duration_minutes: 60,
        price: 700,
        discount_price: null,
        display_order: 5
      },
      {
        code: 'ruqyah-home-family',
        name: 'Family and Home Ruqyah Service',
        category: 'ruqyah',
        description: 'On-site home visitation in Feni region for home purification recitation, family counseling, and severe bedridden cases.',
        duration_minutes: 90,
        price: 3500,
        discount_price: null,
        display_order: 6
      },
      {
        code: 'ruqyah-online',
        name: 'Online Ruqyah Consultation',
        category: 'consultation',
        description: 'Live video/audio consultation for patients residing outside Feni or overseas, preliminary assessment and home recitation plan.',
        duration_minutes: 45,
        price: 1000,
        discount_price: 800,
        display_order: 7
      },
      {
        code: 'ruqyah-hijama-combo',
        name: 'Comprehensive Wellness Package (Ruqyah + Hijama)',
        category: 'ruqyah',
        description: 'Combined therapeutic package incorporating full Ruqyah diagnosis session followed by tailored Sunnah cupping for maximum holistic benefit.',
        duration_minutes: 90,
        price: 2500,
        discount_price: 2200,
        display_order: 8
      }
    ];

    const insertService = db.prepare(`
      INSERT INTO services (code, name, category, description, duration_minutes, price, discount_price, is_active, display_order)
      VALUES (@code, @name, @category, @description, @duration_minutes, @price, @discount_price, 1, @display_order)
    `);

    for (const s of defaultServices) {
      insertService.run(s);
    }
    console.log(`Seeded ${defaultServices.length} default services.`);
  }

  // 5. Seed sample patient and history
  const patientCount = db.prepare('SELECT COUNT(*) as count FROM patients').get().count;
  if (patientCount === 0) {
    const insertPatient = db.prepare(`
      INSERT INTO patients (patient_id, full_name, phone, age, gender, address, emergency_contact, marital_status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPatient.run(
      'RSCC-P-1001',
      'Tariqul Islam',
      '01812345678',
      34,
      'Male',
      'Rampur, Feni Sadar, Feni',
      'Brother: 01899887766',
      'Married',
      'Complains of sudden severe chest tightness and recurring nightmares since past 6 months.'
    );

    insertPatient.run(
      'RSCC-P-1002',
      'Fatima Begum',
      '01711223344',
      28,
      'Female',
      'Dagonbhuiyan, Feni',
      'Husband: 01799001122',
      'Married',
      'Accompanied by husband. Chronic unexplainable headaches and sudden extreme aversion during Salah.'
    );

    // Patient histories
    const insertHistory = db.prepare(`
      INSERT INTO patient_histories (
        patient_id, main_symptoms, physical_symptoms, sleep_problems, dream_problems,
        worship_problems, family_history, financial_family_situation,
        previous_medical_history, duration_of_problems, additional_information, recorded_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertHistory.run(
      'RSCC-P-1001',
      JSON.stringify(['Chest heaviness & suffocation', 'Sudden unprovoked anger', 'Constant exhaustion']),
      JSON.stringify(['Upper back stiffness', 'Stomach tingling sensation', 'Tension headache']),
      JSON.stringify(['Insomnia', 'Frequent sudden awakenings', 'Sleep paralysis (Kaboos)']),
      JSON.stringify(['Black dogs chasing', 'Falling from high structures', 'Graveyards']),
      JSON.stringify(['Intrusive doubts (Waswas) during Wudu', 'Sudden heavy yawning during Adhan']),
      'No hereditary mental illness. Happy family background.',
      'Experienced sudden unexplained loss in wholesale textile business 7 months ago.',
      'Visited cardiologist and neurologist at Feni General Hospital; ECG, Echo and Brain MRI all reported completely normal.',
      '6 to 12 months',
      'Patient previously given an amulet (taweez) by a village healer which was subsequently removed and burned according to Sunnah.',
      'Muhammadullah Miah'
    );

    insertHistory.run(
      'RSCC-P-1002',
      JSON.stringify(['Severe one-sided headache', 'Numbness in hands', 'Sudden crying without reason']),
      JSON.stringify(['Migraine unaffected by painkillers', 'Cold sensation in lower feet']),
      JSON.stringify(['Night terrors', 'Restlessness']),
      JSON.stringify(['Snakes and scorpions', 'Drowning in turbid water']),
      JSON.stringify(['Extreme aversion to hearing Surah Al-Baqarah', 'Difficulty completing 5 daily prayers on time']),
      'Normal family medical history.',
      'Stable family situation, but sudden marital tension began 4 months ago.',
      'ENT and Neurological consultations showed no organic pathology.',
      '4 months',
      'Female hijama therapist requested for cupping sessions.',
      'Muhammadullah Miah'
    );

    // Seed Appointments
    const insertApt = db.prepare(`
      INSERT INTO appointments (
        appointment_id, patient_id, patient_name, patient_phone, patient_address,
        service_id, service_name, appointment_date, time_slot, slot_start_time,
        number_of_patients, additional_notes, status, admin_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Appointment 1: Today
    const today = new Date().toISOString().split('T')[0];
    insertApt.run(
      'APT-20261118-001',
      'RSCC-P-1001',
      'Tariqul Islam',
      '01812345678',
      'Rampur, Feni Sadar, Feni',
      1,
      'Ruqyah Shariah Diagnosis & Initial Treatment',
      today,
      '09:00 AM – 10:00 AM',
      '09:00',
      1,
      'First time visit for initial evaluation.',
      'Confirmed',
      'Patient confirmed arrival with brother.'
    );

    // Appointment 2: Next day
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    insertApt.run(
      'APT-20261118-002',
      'RSCC-P-1002',
      'Fatima Begum',
      '01711223344',
      'Dagonbhuiyan, Feni',
      3,
      'Sunnah Hijama (Full Body Cupping Therapy)',
      tomorrow,
      '11:00 AM – 12:00 PM',
      '11:00',
      1,
      'Female therapist requested for Hijama.',
      'Pending',
      'Awaiting confirmation call from reception.'
    );

    // Seed Ruqyah Session for P-1001
    db.prepare(`
      INSERT INTO ruqyah_sessions (
        session_id, patient_id, appointment_id, session_number, session_date,
        raqi_name, initial_assessment, reported_symptoms, medical_history_checked,
        quranic_verses_recited, authentic_supplications, observed_reactions,
        raqi_observations, professional_assessment, assessment_category,
        prescribed_remedies, recommendations, next_followup_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'RS-1001-01',
      'RSCC-P-1001',
      'APT-20261118-001',
      1,
      today,
      'Muhammadullah Miah',
      'Patient arrived alert but visibly anxious with tense shoulder posture.',
      'Chest constriction, palpitation, recurring black dog nightmares.',
      'Cardiology clearance verified, no cardiac abnormalities detected.',
      JSON.stringify([
        'Surah Al-Fatihah (7 times)',
        'Ayat al-Kursi (Al-Baqarah: 255)',
        'Al-Baqarah: 102 (Verses of Sihr)',
        'Al-Baqarah: 284-286',
        'Al-A\'raf: 117-122 (Moses and Sorcerers)',
        'Yunus: 81-82 (Nullification of magic)',
        'Ta-Ha: 69',
        'As-Saffat: 1-10',
        'Al-Ikhlas, Al-Falaq, An-Nas (3 times each)'
      ]),
      JSON.stringify([
        'Adhhibil-ba\'sa Rabban-naas, ishfi wa Antash-Shaafee...',
        'Bismillahi arqeeka, min kulli shay\'in yu\'dheeka...',
        'A\'oodhu bi-kalimaatillaahit-taammaati min sharri maa khalaq...',
        'Hasbiyallahu la ilaha illa Huwa, \'alayhi tawakkaltu...'
      ]),
      JSON.stringify([
        'Severe trembling in right arm and knee during recitation of Al-Baqarah 102',
        'Deep repeated yawning during Mu\'awwidhatayn',
        'Profuse cold sweating on forehead',
        'Temporary nausea but no vomiting'
      ]),
      'Noticeable physical reaction to verses addressing Sihr and Hasad. Patient maintained consciousness throughout. Breathing stabilized immediately after recitation concluded with Duas.',
      'Signs consistent with spiritual distress / suspected affliction with strong element of Hasad (Evil Eye) affecting livelihood and well-being. No psychosis observed. Patient responded positively to Prophetic supplications.',
      'Spiritual Affliction Suspected (Hasad/Evil Eye)',
      JSON.stringify([
        'Ruqyah-recited water: 1 glass to drink every morning on empty stomach',
        'Ruqyah water bathing for 7 consecutive days (adding 7 crushed green Sidr leaves)',
        'Olive oil recited upon: massage neck, chest and joints before sleeping',
        'Pure Black Seed (Kalonji) oil: 5 drops with warm water daily',
        'Strict adherence to Morning & Evening Adhkar (Hisnul Muslim)'
      ]),
      'Maintain 5 daily prayers in congregation at Masjid. Discontinue all un-Islamic amulets permanently. Perform Istighfar 100 times daily.',
      new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      'Completed'
    );

    // Seed Follow-up
    db.prepare(`
      INSERT INTO follow_ups (
        patient_id, previous_session_id, followup_date, scheduled_time,
        symptom_progression, symptom_changes_notes, new_observations,
        treatment_progress_summary, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'RSCC-P-1001',
      'RS-1001-01',
      new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      '10:00 AM – 11:00 AM',
      'Mildly Improved',
      'Chest heaviness reduced by ~40% after 3 days of Sidr baths. Nightmares reduced in intensity.',
      'Patient appears calmer and reported better focus during Salah.',
      'Initial treatment plan showing promising positive response. Ready for follow-up evaluation and booster recitation.',
      'Scheduled'
    );

    // Seed audit log
    db.prepare(`
      INSERT INTO audit_logs (admin_username, action, target_type, target_id, details)
      VALUES (?, ?, ?, ?, ?)
    `).run('system', 'SEED_INIT', 'SYSTEM', '1', 'Initial database seeding completed successfully.');

    console.log('Seeded sample patients, appointments, sessions, and follow-ups.');
  }

  // Run Migration V3 (Diagnosis Categories & Symptoms)
  try {
    const { runMigration: runV3 } = require('./migrate_v3_diagnosis');
    runV3();
  } catch (err) {
    console.error('Migration V3 in seed error:', err.message);
  }

  console.log('Database initialization and seeding completed successfully!');
}

seed();
