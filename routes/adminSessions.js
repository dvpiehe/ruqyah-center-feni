const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

router.use(requireAdmin);

/**
 * GET /api/admin/sessions
 * List all Ruqyah sessions with filters
 */
router.get('/', (req, res) => {
  try {
    const { patient_id, category, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT 
        s.*,
        p.full_name as patient_name,
        p.phone as patient_phone,
        p.age as patient_age,
        p.gender as patient_gender
      FROM ruqyah_sessions s
      JOIN patients p ON s.patient_id = p.patient_id
      WHERE 1=1
    `;
    const params = [];

    if (patient_id) {
      query += ` AND s.patient_id = ?`;
      params.push(patient_id.trim());
    }

    if (category) {
      query += ` AND (s.assessment_category = ? OR s.manual_diagnosis LIKE ?)`;
      params.push(category.trim(), `%${category.trim()}%`);
    }

    query += ` ORDER BY s.session_date DESC, s.id DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const sessions = db.prepare(query).all(...params);

    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/sessions/:id
 * Get single session details
 */
router.get('/:id', (req, res) => {
  try {
    const session = db.prepare(`
      SELECT s.*, p.full_name as patient_name, p.phone as patient_phone, p.age as patient_age, p.gender as patient_gender, p.address as patient_address
      FROM ruqyah_sessions s
      JOIN patients p ON s.patient_id = p.patient_id
      WHERE s.id = ? OR s.session_id = ?
    `).get(req.params.id, req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, error: 'Ruqyah session record not found.' });
    }

    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/sessions
 * Record new Ruqyah session
 */
router.post('/', (req, res) => {
  try {
    const {
      patient_id,
      appointment_id,
      session_date,
      raqi_name = 'Muhammadullah Miah',
      patient_main_symptoms,
      initial_assessment,
      reported_symptoms,
      medical_history_checked,
      quranic_verses_recited,
      authentic_supplications,
      observed_reactions,
      physical_observations,
      raqi_observations,
      manual_diagnosis,
      professional_assessment,
      assessment_category,
      prescribed_amal,
      prescribed_remedies,
      raqi_comments,
      special_advice,
      recommendations,
      next_followup_date,
      status = 'Completed'
    } = req.body;

    // Parse and normalize manual_diagnosis
    let parsedManualDiag = [];
    if (Array.isArray(manual_diagnosis)) {
      parsedManualDiag = manual_diagnosis.filter(Boolean);
    } else if (typeof manual_diagnosis === 'string' && manual_diagnosis.trim().length > 0) {
      try {
        const parsed = JSON.parse(manual_diagnosis);
        parsedManualDiag = Array.isArray(parsed) ? parsed : [manual_diagnosis.trim()];
      } catch {
        parsedManualDiag = manual_diagnosis.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const effectiveCategory = assessment_category || (parsedManualDiag.length > 0 ? parsedManualDiag.join(', ') : 'Spiritual Affliction Evaluated');

    if (!patient_id || !session_date || (!effectiveCategory && parsedManualDiag.length === 0)) {
      return res.status(400).json({
        success: false,
        error: 'Patient ID, Session Date, and Diagnostic Assessment Category are required.'
      });
    }

    const patient = db.prepare('SELECT id, full_name, patient_id FROM patients WHERE patient_id = ?').get(patient_id.trim());
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    // Determine session number for this patient
    const countRecord = db.prepare('SELECT COUNT(*) as count FROM ruqyah_sessions WHERE patient_id = ?').get(patient_id.trim());
    const sessionNumber = countRecord.count + 1;
    const cleanPId = patient_id.replace(/^RSCC-P-/, 'P');
    const sessionId = `RS-${cleanPId}-${String(sessionNumber).padStart(2, '0')}`;

    const serialize = (val) => {
      if (val === null || val === undefined) return '[]';
      if (typeof val === 'string') return val;
      return JSON.stringify(val);
    };

    const finalReportedSymptoms = (patient_main_symptoms || reported_symptoms || '').trim();
    const finalPatientMainSymptoms = (patient_main_symptoms || reported_symptoms || '').trim();
    const finalPrescribedAmal = (prescribed_amal || (typeof prescribed_remedies === 'string' ? prescribed_remedies : '')).trim();
    const finalRaqiComments = (raqi_comments || professional_assessment || '').trim();
    const finalSpecialAdvice = (special_advice || recommendations || '').trim();
    const finalPhysicalObservations = (physical_observations || raqi_observations || '').trim();

    const sessionTx = db.transaction(() => {
      db.prepare(`
        INSERT INTO ruqyah_sessions (
          session_id, patient_id, appointment_id, session_number, session_date,
          raqi_name, initial_assessment, reported_symptoms, medical_history_checked,
          quranic_verses_recited, authentic_supplications, observed_reactions,
          raqi_observations, professional_assessment, assessment_category,
          prescribed_remedies, recommendations, next_followup_date, status,
          manual_diagnosis, prescribed_amal, raqi_comments, special_advice,
          physical_observations, patient_main_symptoms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        sessionId,
        patient_id.trim(),
        appointment_id ? appointment_id.trim() : null,
        sessionNumber,
        session_date,
        (raqi_name || 'Muhammadullah Miah').trim(),
        initial_assessment ? initial_assessment.trim() : null,
        finalReportedSymptoms || null,
        medical_history_checked ? medical_history_checked.trim() : null,
        serialize(quranic_verses_recited),
        serialize(authentic_supplications),
        serialize(observed_reactions),
        finalPhysicalObservations || null,
        finalRaqiComments || null,
        effectiveCategory,
        finalPrescribedAmal ? (typeof prescribed_remedies === 'object' ? serialize(prescribed_remedies) : finalPrescribedAmal) : serialize(prescribed_remedies),
        finalSpecialAdvice || null,
        next_followup_date || null,
        status,
        JSON.stringify(parsedManualDiag),
        finalPrescribedAmal || null,
        finalRaqiComments || null,
        finalSpecialAdvice || null,
        finalPhysicalObservations || null,
        finalPatientMainSymptoms || null
      );

      // If next followup date provided, create scheduled followup record
      if (next_followup_date) {
        db.prepare(`
          INSERT INTO follow_ups (patient_id, previous_session_id, followup_date, status, treatment_progress_summary)
          VALUES (?, ?, ?, 'Scheduled', ?)
        `).run(
          patient_id.trim(),
          sessionId,
          next_followup_date,
          `Follow-up scheduled from Session #${sessionNumber} (${effectiveCategory})`
        );
      }

      // If appointment_id provided, mark appointment as completed
      if (appointment_id) {
        db.prepare('UPDATE appointments SET status = "Completed", updated_at = CURRENT_TIMESTAMP WHERE appointment_id = ?')
          .run(appointment_id.trim());
      }
    });

    sessionTx();

    logAudit(
      req.admin.username,
      'CREATE_RUQYAH_SESSION',
      'SESSION',
      sessionId,
      `Recorded Ruqyah Session #${sessionNumber} for ${patient.full_name} (${effectiveCategory})`,
      req
    );

    res.status(201).json({
      success: true,
      message: `Ruqyah session recorded successfully as ${sessionId}.`,
      session_id: sessionId
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/sessions/:id
 * Edit existing session details
 */
router.put('/:id', (req, res) => {
  try {
    const session = db.prepare('SELECT * FROM ruqyah_sessions WHERE id = ? OR session_id = ?').get(req.params.id, req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found.' });
    }

    const {
      raqi_name,
      patient_main_symptoms,
      initial_assessment,
      reported_symptoms,
      medical_history_checked,
      quranic_verses_recited,
      authentic_supplications,
      observed_reactions,
      physical_observations,
      raqi_observations,
      manual_diagnosis,
      professional_assessment,
      assessment_category,
      prescribed_amal,
      prescribed_remedies,
      raqi_comments,
      special_advice,
      recommendations,
      next_followup_date,
      status
    } = req.body;

    const serialize = (val) => {
      if (val === null || val === undefined) return null;
      if (typeof val === 'string') return val;
      return JSON.stringify(val);
    };

    let parsedManualDiagStr = null;
    if (manual_diagnosis !== undefined) {
      if (Array.isArray(manual_diagnosis)) {
        parsedManualDiagStr = JSON.stringify(manual_diagnosis.filter(Boolean));
      } else if (typeof manual_diagnosis === 'string') {
        parsedManualDiagStr = manual_diagnosis.startsWith('[') ? manual_diagnosis : JSON.stringify([manual_diagnosis.trim()]);
      }
    }

    const effectiveCategory = assessment_category || (parsedManualDiagStr ? JSON.parse(parsedManualDiagStr).join(', ') : null);

    db.prepare(`
      UPDATE ruqyah_sessions
      SET 
        raqi_name = COALESCE(?, raqi_name),
        initial_assessment = COALESCE(?, initial_assessment),
        reported_symptoms = COALESCE(?, reported_symptoms),
        medical_history_checked = COALESCE(?, medical_history_checked),
        quranic_verses_recited = COALESCE(?, quranic_verses_recited),
        authentic_supplications = COALESCE(?, authentic_supplications),
        observed_reactions = COALESCE(?, observed_reactions),
        raqi_observations = COALESCE(?, raqi_observations),
        professional_assessment = COALESCE(?, professional_assessment),
        assessment_category = COALESCE(?, assessment_category),
        prescribed_remedies = COALESCE(?, prescribed_remedies),
        recommendations = COALESCE(?, recommendations),
        next_followup_date = COALESCE(?, next_followup_date),
        status = COALESCE(?, status),
        manual_diagnosis = COALESCE(?, manual_diagnosis),
        prescribed_amal = COALESCE(?, prescribed_amal),
        raqi_comments = COALESCE(?, raqi_comments),
        special_advice = COALESCE(?, special_advice),
        physical_observations = COALESCE(?, physical_observations),
        patient_main_symptoms = COALESCE(?, patient_main_symptoms),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      raqi_name || null,
      initial_assessment || null,
      reported_symptoms || patient_main_symptoms || null,
      medical_history_checked || null,
      serialize(quranic_verses_recited),
      serialize(authentic_supplications),
      serialize(observed_reactions),
      physical_observations || raqi_observations || null,
      raqi_comments || professional_assessment || null,
      effectiveCategory || null,
      prescribed_amal || serialize(prescribed_remedies),
      special_advice || recommendations || null,
      next_followup_date || null,
      status || null,
      parsedManualDiagStr,
      prescribed_amal || null,
      raqi_comments || null,
      special_advice || null,
      physical_observations || null,
      patient_main_symptoms || reported_symptoms || null,
      session.id
    );

    logAudit(req.admin.username, 'UPDATE_RUQYAH_SESSION', 'SESSION', session.session_id, 'Updated session details', req);

    res.json({ success: true, message: 'Session updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
