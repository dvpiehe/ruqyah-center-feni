const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { JWT_SECRET } = require('../config/constants');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

/**
 * POST /api/auth/login
 */
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required.' });
    }

    const admin = db.prepare('SELECT * FROM administrators WHERE username = ?').get(username.trim());
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid username or password.' });
    }

    const isValid = bcrypt.compareSync(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid username or password.' });
    }

    // Generate JWT token (expires in 7 days)
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        name: admin.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only secure cookie
    res.cookie('ruqyah_admin_token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    logAudit(admin.username, 'ADMIN_LOGIN', 'ADMIN', admin.id, 'Successful administrator login', req);

    res.json({
      success: true,
      message: 'Login successful.',
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        email: admin.email
      },
      token
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', requireAdmin, (req, res) => {
  logAudit(req.admin.username, 'ADMIN_LOGOUT', 'ADMIN', req.admin.id, 'Administrator logged out', req);
  res.clearCookie('ruqyah_admin_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * GET /api/auth/me
 */
router.get('/me', requireAdmin, (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
});

/**
 * POST /api/auth/change-password
 */
router.post('/change-password', requireAdmin, (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, error: 'Current password and new password are required.' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
    }

    const admin = db.prepare('SELECT password_hash FROM administrators WHERE id = ?').get(req.admin.id);
    const matches = bcrypt.compareSync(current_password, admin.password_hash);
    if (!matches) {
      return res.status(400).json({ success: false, error: 'Current password does not match.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(new_password, salt);

    db.prepare('UPDATE administrators SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(newHash, req.admin.id);

    logAudit(req.admin.username, 'CHANGE_PASSWORD', 'ADMIN', req.admin.id, 'Password changed successfully', req);

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
