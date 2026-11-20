const db = require('../database/db');

function logAudit(adminUsername, action, targetType = null, targetId = null, details = null, req = null) {
  try {
    const ip = req ? (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1') : 'system';
    const stmt = db.prepare(`
      INSERT INTO audit_logs (admin_username, action, target_type, target_id, details, ip_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(adminUsername || 'system', action, targetType, String(targetId || ''), String(details || ''), String(ip));
  } catch (err) {
    console.error('Audit logging error:', err.message);
  }
}

module.exports = {
  logAudit
};
