const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');
const db = require('../database/db');

function requireAdmin(req, res, next) {
  try {
    let token = null;

    if (req.cookies && req.cookies.ruqyah_admin_token) {
      token = req.cookies.ruqyah_admin_token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      if (req.xhr || req.headers.accept?.includes('application/json') || req.path.startsWith('/api/')) {
        return res.status(401).json({ success: false, error: 'Authentication required. Please login.' });
      }
      return res.redirect('/admin/login');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify user still exists in database
    const admin = db.prepare('SELECT id, username, name, email, role FROM administrators WHERE id = ?').get(decoded.id);
    if (!admin) {
      res.clearCookie('ruqyah_admin_token');
      if (req.path.startsWith('/api/')) {
        return res.status(401).json({ success: false, error: 'Invalid session. Admin account not found.' });
      }
      return res.redirect('/admin/login');
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.clearCookie('ruqyah_admin_token');
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ success: false, error: 'Session expired or invalid. Please login again.' });
    }
    return res.redirect('/admin/login');
  }
}

module.exports = {
  requireAdmin
};
