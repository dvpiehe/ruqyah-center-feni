const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

router.use(requireAdmin);

/**
 * GET /api/admin/followups
 * List all follow-ups with patient details and status filters
 */
router.get('/', (req, res) => {
  try {
    const { status, patient_id, upcoming_only } = req.query;

    let query = `
      SELECT 
        f.*,
        p.full_name as patient_name,
        p.phone as patient_phone,
        p.age as patient_age,
        p.gender as patient_gender,
        s.session_number,
        s.assessment_category
      FROM follow_ups f
      JOIN patients p ON f.patient_id = p.patient_id
      LEFT JOIN ruqyah_sessions s ON f.previous_session_id = s.session_id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ` AND f.status = ?`;
      params.push(status.trim());
    }

    if (patient_id) {
      query += ` AND f.patient_id = ?`;
      params.push(patient_id.trim());
    }

    if (upcoming_only === 'true') {
      const today = new Date().toISOString().split('T')[0];
      query += ` AND f.followup_date >= ? AND f.status = 'Scheduled'`;
      params.push(today);
    }

    query += ` ORDER BY f.followup_date ASC, f.id DESC`;

    const followups = db.prepare(query).all(...params);

    res.json({ success: true, count: followups.length, data: followups });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/followups
 * Schedule new follow-up
 */
router.post('/', (req, res) => {
  try {
    const {
      patient_id,
      previous_session_id,
      followup_date,
      scheduled_time,
      symptom_progression = 'Unchanged',
      symptom_changes_notes,
      new_observations,
      treatment_progress_summary,
      status = 'Scheduled'
    } = req.body;

    if (!patient_id || !followup_date) {
      return res.status(400).json({ success: false, error: 'Patient ID and Follow-up date are required.' });
    }

    const patient = db.prepare('SELECT id, full_name FROM patients WHERE patient_id = ?').get(patient_id.trim());
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    const info = db.prepare(`
      INSERT INTO follow_ups (
        patient_id, previous_session_id, followup_date, scheduled_time,
        symptom_progression, symptom_changes_notes, new_observations,
        treatment_progress_summary, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      patient_id.trim(),
      previous_session_id || null,
      followup_date.trim(),
      scheduled_time || null,
      symptom_progression,
      symptom_changes_notes || null,
      new_observations || null,
      treatment_progress_summary || null,
      status
    );

    logAudit(req.admin.username, 'SCHEDULE_FOLLOWUP', 'FOLLOWUP', info.lastInsertRowid, `Scheduled follow-up for ${patient.full_name} on ${followup_date}`, req);

    res.status(201).json({
      success: true,
      message: 'Follow-up appointment scheduled successfully.',
      followup_id: info.lastInsertRowid
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/followups/:id
 * Update follow-up evaluation and progress notes
 */
router.put('/:id', (req, res) => {
  try {
    const {
      symptom_progression,
      symptom_changes_notes,
      new_observations,
      treatment_progress_summary,
      status
    } = req.body;

    const followup = db.prepare('SELECT * FROM follow_ups WHERE id = ?').get(req.params.id);
    if (!followup) {
      return res.status(404).json({ success: false, error: 'Follow-up record not found.' });
    }

    db.prepare(`
      UPDATE follow_ups
      SET 
        symptom_progression = COALESCE(?, symptom_progression),
        symptom_changes_notes = COALESCE(?, symptom_changes_notes),
        new_observations = COALESCE(?, new_observations),
        treatment_progress_summary = COALESCE(?, treatment_progress_summary),
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      symptom_progression || null,
      symptom_changes_notes || null,
      new_observations || null,
      treatment_progress_summary || null,
      status || null,
      followup.id
    );

    logAudit(req.admin.username, 'UPDATE_FOLLOWUP', 'FOLLOWUP', followup.id, `Updated follow-up status to ${status || followup.status}`, req);

    res.json({ success: true, message: 'Follow-up progress record updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
