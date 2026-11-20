const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

router.use(requireAdmin);

/**
 * GET /api/admin/patients
 * Search and list patients with history counts and session counts
 */
router.get('/', (req, res) => {
  try {
    const { search, gender, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT 
        p.id, p.patient_id, p.full_name, p.phone, p.age, p.gender,
        p.address, p.emergency_contact, p.marital_status, p.registration_date, p.notes,
        (SELECT COUNT(*) FROM appointments a WHERE a.patient_id = p.patient_id) as total_appointments,
        (SELECT COUNT(*) FROM ruqyah_sessions s WHERE s.patient_id = p.patient_id) as total_sessions,
        (SELECT COUNT(*) FROM follow_ups f WHERE f.patient_id = p.patient_id) as total_followups,
        CASE WHEN h.id IS NOT NULL THEN 1 ELSE 0 END as has_history
      FROM patients p
      LEFT JOIN patient_histories h ON p.patient_id = h.patient_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (p.patient_id LIKE ? OR p.full_name LIKE ? OR p.phone LIKE ?)`;
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    if (gender) {
      query += ` AND p.gender = ?`;
      params.push(gender.trim());
    }

    query += ` ORDER BY p.id DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const patients = db.prepare(query).all(...params);

    // Count
    let countQuery = `SELECT COUNT(*) as total FROM patients p WHERE 1=1`;
    const countParams = [];
    if (search) {
      countQuery += ` AND (p.patient_id LIKE ? OR p.full_name LIKE ? OR p.phone LIKE ?)`;
      const s = `%${search.trim()}%`;
      countParams.push(s, s, s);
    }
    if (gender) {
      countQuery += ` AND p.gender = ?`;
      countParams.push(gender.trim());
    }
    const total = db.prepare(countQuery).get(...countParams).total;

    res.json({ success: true, total, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/patients
 * Register new patient directly
 */
router.post('/', (req, res) => {
  try {
    const { full_name, phone, age, gender, address, emergency_contact, marital_status, notes } = req.body;

    if (!full_name || !phone) {
      return res.status(400).json({ success: false, error: 'Full name and phone number are required.' });
    }

    // Check duplicate phone
    const existing = db.prepare('SELECT patient_id, full_name FROM patients WHERE phone = ?').get(phone.trim());
    if (existing) {
      return res.status(400).json({
        success: false,
        error: `A patient with this mobile number already exists: ${existing.full_name} (${existing.patient_id})`
      });
    }

    const last = db.prepare('SELECT id FROM patients ORDER BY id DESC LIMIT 1').get();
    const nextNum = (last ? last.id : 0) + 1001;
    const patientId = `RSCC-P-${nextNum}`;

    db.prepare(`
      INSERT INTO patients (patient_id, full_name, phone, age, gender, address, emergency_contact, marital_status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      patientId,
      full_name.trim(),
      phone.trim(),
      parseInt(age, 10) || 30,
      gender || 'Male',
      address ? address.trim() : 'Feni',
      emergency_contact ? emergency_contact.trim() : null,
      marital_status || 'Married',
      notes ? notes.trim() : null
    );

    logAudit(req.admin.username, 'REGISTER_PATIENT', 'PATIENT', patientId, `Registered patient ${full_name}`, req);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully.',
      data: { patient_id: patientId }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/patients/:id
 * Complete patient dossier: info, 10-category history, appointments, Ruqyah sessions, and follow-ups
 */
router.get('/:id', (req, res) => {
  try {
    const patient = db.prepare(`
      SELECT * FROM patients WHERE id = ? OR patient_id = ?
    `).get(req.params.id, req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    // 10-category history
    const history = db.prepare(`
      SELECT * FROM patient_histories WHERE patient_id = ?
    `).get(patient.patient_id);

    // Appointments
    const appointments = db.prepare(`
      SELECT * FROM appointments WHERE patient_id = ? OR patient_phone = ? ORDER BY appointment_date DESC
    `).all(patient.patient_id, patient.phone);

    // Ruqyah Sessions
    const sessions = db.prepare(`
      SELECT * FROM ruqyah_sessions WHERE patient_id = ? ORDER BY session_date DESC, session_number DESC
    `).all(patient.patient_id);

    // Follow-ups
    const followups = db.prepare(`
      SELECT * FROM follow_ups WHERE patient_id = ? ORDER BY followup_date DESC
    `).all(patient.patient_id);

    // Diagnosis record (9 categories / 90 symptoms)
    const diagnosis = db.prepare(`
      SELECT * FROM patient_diagnoses WHERE patient_id = ? ORDER BY id DESC LIMIT 1
    `).get(patient.patient_id);

    res.json({
      success: true,
      data: {
        patient,
        history: history || null,
        diagnosis: diagnosis || null,
        appointments,
        sessions,
        followups
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/patients/:id
 * Update basic demographic info
 */
router.put('/:id', (req, res) => {
  try {
    const { full_name, phone, age, gender, address, emergency_contact, marital_status, notes } = req.body;

    const patient = db.prepare('SELECT * FROM patients WHERE id = ? OR patient_id = ?').get(req.params.id, req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    db.prepare(`
      UPDATE patients
      SET 
        full_name = COALESCE(?, full_name),
        phone = COALESCE(?, phone),
        age = COALESCE(?, age),
        gender = COALESCE(?, gender),
        address = COALESCE(?, address),
        emergency_contact = COALESCE(?, emergency_contact),
        marital_status = COALESCE(?, marital_status),
        notes = COALESCE(?, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      full_name ? full_name.trim() : null,
      phone ? phone.trim() : null,
      age !== undefined ? parseInt(age, 10) : null,
      gender || null,
      address ? address.trim() : null,
      emergency_contact ? emergency_contact.trim() : null,
      marital_status || null,
      notes ? notes.trim() : null,
      patient.id
    );

    logAudit(req.admin.username, 'UPDATE_PATIENT', 'PATIENT', patient.patient_id, `Updated profile for ${patient.full_name}`, req);

    res.json({ success: true, message: 'Patient profile updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/patients/:id/history
 * Save or update structured 10-category clinical and Ruqyah history
 */
router.put('/:id/history', (req, res) => {
  try {
    const patient = db.prepare('SELECT * FROM patients WHERE id = ? OR patient_id = ?').get(req.params.id, req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    const {
      main_symptoms,
      physical_symptoms,
      sleep_problems,
      dream_problems,
      worship_problems,
      family_history,
      genetic_history,
      financial_family_situation,
      rizq_family_situation,
      previous_medical_history,
      previous_treatment_history,
      duration_of_problems,
      problem_duration,
      additional_information
    } = req.body;

    const probDuration = problem_duration || duration_of_problems || null;
    const prevTreatment = previous_treatment_history || previous_medical_history || null;
    const rizqFamily = rizq_family_situation || financial_family_situation || null;
    const genHistory = genetic_history || family_history || null;

    const serialize = (val) => {
      if (val === null || val === undefined) return '[]';
      if (typeof val === 'string') return val;
      return JSON.stringify(val);
    };

    const stmt = db.prepare(`
      INSERT INTO patient_histories (
        patient_id, main_symptoms, physical_symptoms, sleep_problems, dream_problems,
        worship_problems, family_history, genetic_history,
        financial_family_situation, rizq_family_situation,
        previous_medical_history, previous_treatment_history,
        duration_of_problems, problem_duration,
        additional_information, recorded_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(patient_id) DO UPDATE SET
        main_symptoms = excluded.main_symptoms,
        physical_symptoms = excluded.physical_symptoms,
        sleep_problems = excluded.sleep_problems,
        dream_problems = excluded.dream_problems,
        worship_problems = excluded.worship_problems,
        family_history = excluded.family_history,
        genetic_history = excluded.genetic_history,
        financial_family_situation = excluded.financial_family_situation,
        rizq_family_situation = excluded.rizq_family_situation,
        previous_medical_history = excluded.previous_medical_history,
        previous_treatment_history = excluded.previous_treatment_history,
        duration_of_problems = excluded.duration_of_problems,
        problem_duration = excluded.problem_duration,
        additional_information = excluded.additional_information,
        recorded_by = excluded.recorded_by,
        updated_at = CURRENT_TIMESTAMP
    `);

    stmt.run(
      patient.patient_id,
      serialize(main_symptoms),
      serialize(physical_symptoms),
      serialize(sleep_problems),
      serialize(dream_problems),
      serialize(worship_problems),
      genHistory,
      genHistory,
      rizqFamily,
      rizqFamily,
      prevTreatment,
      prevTreatment,
      probDuration,
      probDuration,
      additional_information || null,
      req.admin.name
    );

    logAudit(req.admin.username, 'SAVE_PATIENT_HISTORY', 'PATIENT_HISTORY', patient.patient_id, `Saved 10-category history for ${patient.full_name}`, req);

    res.json({
      success: true,
      message: `Patient history saved successfully for ${patient.full_name} (${patient.patient_id}).`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
