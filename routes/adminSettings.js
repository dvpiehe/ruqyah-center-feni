const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../database/db');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

router.use(requireAdmin);

// Storage for clinic logo upload
const logoDir = path.join(__dirname, '..', 'public', 'images');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, logoDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `custom-logo-${Date.now()}${ext}`);
  }
});
const logoUpload = multer({
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpg, jpeg, png, webp, svg) are allowed.'));
  }
});

/**
 * GET /api/admin/settings/dashboard-metrics
 * Overview dashboard counters
 */
router.get('/dashboard-metrics', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalPatients = db.prepare('SELECT COUNT(*) as c FROM patients').get().c;
    const todayAppointments = db.prepare('SELECT COUNT(*) as c FROM appointments WHERE appointment_date = ?').get(today).c;
    const upcomingAppointments = db.prepare('SELECT COUNT(*) as c FROM appointments WHERE appointment_date > ? AND status NOT IN ("Cancelled", "Completed")').get(today).c;
    const pendingAppointments = db.prepare('SELECT COUNT(*) as c FROM appointments WHERE status = "Pending"').get().c;
    const completedAppointments = db.prepare('SELECT COUNT(*) as c FROM appointments WHERE status = "Completed"').get().c;
    const cancelledAppointments = db.prepare('SELECT COUNT(*) as c FROM appointments WHERE status = "Cancelled"').get().c;

    const totalRuqyahSessions = db.prepare('SELECT COUNT(*) as c FROM ruqyah_sessions').get().c;
    const totalHijamaSessions = db.prepare('SELECT COUNT(*) as c FROM appointments WHERE service_name LIKE "%Hijama%" AND status = "Completed"').get().c;

    const upcomingFollowups = db.prepare(`
      SELECT f.*, p.full_name as patient_name, p.phone as patient_phone
      FROM follow_ups f
      JOIN patients p ON f.patient_id = p.patient_id
      WHERE f.followup_date >= ? AND f.status = 'Scheduled'
      ORDER BY f.followup_date ASC
      LIMIT 10
    `).all(today);

    const todayList = db.prepare(`
      SELECT * FROM appointments
      WHERE appointment_date = ?
      ORDER BY slot_start_time ASC
    `).all(today);

    res.json({
      success: true,
      data: {
        totalPatients,
        todayAppointments,
        upcomingAppointments,
        pendingAppointments,
        completedAppointments,
        cancelledAppointments,
        totalRuqyahSessions,
        totalHijamaSessions,
        upcomingFollowups,
        todayList
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/settings
 * Clinic settings
 */
router.get('/', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM clinic_settings WHERE id = 1').get();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/settings
 * Update clinic profile settings
 */
router.put('/', (req, res) => {
  try {
    const {
      business_name,
      branch_name,
      raqi_name,
      phone,
      whatsapp,
      address,
      email,
      hours,
      emergency_notes,
      logo_url
    } = req.body;

    db.prepare(`
      UPDATE clinic_settings
      SET 
        business_name = COALESCE(?, business_name),
        branch_name = COALESCE(?, branch_name),
        raqi_name = COALESCE(?, raqi_name),
        phone = COALESCE(?, phone),
        whatsapp = COALESCE(?, whatsapp),
        address = COALESCE(?, address),
        email = COALESCE(?, email),
        hours = COALESCE(?, hours),
        emergency_notes = COALESCE(?, emergency_notes),
        logo_url = COALESCE(?, logo_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(
      business_name ? business_name.trim() : null,
      branch_name ? branch_name.trim() : null,
      raqi_name ? raqi_name.trim() : null,
      phone ? phone.trim() : null,
      whatsapp ? whatsapp.trim() : null,
      address ? address.trim() : null,
      email ? email.trim() : null,
      hours ? hours.trim() : null,
      emergency_notes ? emergency_notes.trim() : null,
      logo_url ? logo_url.trim() : null
    );

    logAudit(req.admin.username, 'UPDATE_CLINIC_SETTINGS', 'SETTINGS', '1', 'Updated clinic profile settings', req);

    res.json({ success: true, message: 'Clinic settings updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/settings/logo
 * Upload and set new clinic logo
 */
router.post('/logo', (req, res) => {
  logoUpload.single('logo')(req, res, err => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No logo image file was provided.' });
    }

    const newLogoUrl = `/images/${req.file.filename}`;
    db.prepare('UPDATE clinic_settings SET logo_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1').run(newLogoUrl);

    logAudit(req.admin.username, 'UPDATE_LOGO', 'SETTINGS', '1', `Uploaded new clinic logo: ${newLogoUrl}`, req);

    res.json({
      success: true,
      message: 'Clinic logo updated successfully.',
      logo_url: newLogoUrl
    });
  });
});

/**
 * GET /api/admin/settings/audit-logs
 * List audit trail
 */
router.get('/audit-logs', (req, res) => {
  try {
    const logs = db.prepare(`
      SELECT * FROM audit_logs
      ORDER BY id DESC
      LIMIT 100
    `).all();

    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/settings/backup
 * Download full database JSON export
 */
router.get('/backup', (req, res) => {
  try {
    const backupData = {
      export_date: new Date().toISOString(),
      exported_by: req.admin.username,
      clinic_settings: db.prepare('SELECT * FROM clinic_settings').all(),
      services: db.prepare('SELECT * FROM services').all(),
      availability_settings: db.prepare('SELECT * FROM availability_settings').all(),
      closed_dates: db.prepare('SELECT * FROM closed_dates').all(),
      blocked_time_slots: db.prepare('SELECT * FROM blocked_time_slots').all(),
      patients: db.prepare('SELECT * FROM patients').all(),
      patient_histories: db.prepare('SELECT * FROM patient_histories').all(),
      appointments: db.prepare('SELECT * FROM appointments').all(),
      ruqyah_sessions: db.prepare('SELECT * FROM ruqyah_sessions').all(),
      follow_ups: db.prepare('SELECT * FROM follow_ups').all()
    };

    logAudit(req.admin.username, 'DATABASE_BACKUP', 'SYSTEM', '1', 'Exported full database backup', req);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="Ruqyah_Clinic_Backup_${new Date().toISOString().split('T')[0]}.json"`);
    res.send(JSON.stringify(backupData, null, 2));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
