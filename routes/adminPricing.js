const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

router.use(requireAdmin);

/**
 * GET /api/admin/pricing
 * List all services with full management details
 */
router.get('/', (req, res) => {
  try {
    const services = db.prepare(`
      SELECT 
        s.*,
        (SELECT COUNT(*) FROM appointments a WHERE a.service_id = s.id) as booking_count
      FROM services s
      ORDER BY s.display_order ASC, s.id ASC
    `).all();

    res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/pricing
 * Add a new service / package
 */
router.post('/', (req, res) => {
  try {
    const {
      name,
      category,
      description,
      duration_minutes = 60,
      price,
      discount_price,
      is_active = 1,
      display_order = 0
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ success: false, error: 'Service name, category, and price are required.' });
    }

    // Generate unique slug code
    const baseCode = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let code = baseCode;
    let counter = 1;
    while (db.prepare('SELECT id FROM services WHERE code = ?').get(code)) {
      code = `${baseCode}-${counter++}`;
    }

    const info = db.prepare(`
      INSERT INTO services (code, name, category, description, duration_minutes, price, discount_price, is_active, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      code,
      name.trim(),
      category.trim(),
      description ? description.trim() : null,
      parseInt(duration_minutes, 10) || 60,
      parseFloat(price),
      discount_price !== undefined && discount_price !== '' && discount_price !== null ? parseFloat(discount_price) : null,
      is_active ? 1 : 0,
      parseInt(display_order, 10) || 0
    );

    logAudit(req.admin.username, 'CREATE_SERVICE', 'SERVICE', info.lastInsertRowid, `Created service ${name} (BDT ${price})`, req);

    res.status(201).json({
      success: true,
      message: 'Service added successfully.',
      service_id: info.lastInsertRowid
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/pricing/:id
 * Edit service details and price
 */
router.put('/:id', (req, res) => {
  try {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found.' });
    }

    const {
      name,
      category,
      description,
      duration_minutes,
      price,
      discount_price,
      is_active,
      display_order
    } = req.body;

    db.prepare(`
      UPDATE services
      SET 
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        description = COALESCE(?, description),
        duration_minutes = COALESCE(?, duration_minutes),
        price = COALESCE(?, price),
        discount_price = ?,
        is_active = COALESCE(?, is_active),
        display_order = COALESCE(?, display_order),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name ? name.trim() : null,
      category || null,
      description !== undefined ? (description ? description.trim() : null) : service.description,
      duration_minutes !== undefined ? parseInt(duration_minutes, 10) : null,
      price !== undefined ? parseFloat(price) : null,
      discount_price !== undefined && discount_price !== '' && discount_price !== null ? parseFloat(discount_price) : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      display_order !== undefined ? parseInt(display_order, 10) : null,
      service.id
    );

    logAudit(req.admin.username, 'UPDATE_SERVICE', 'SERVICE', service.id, `Updated service ${name || service.name}. Price: ${price || service.price}`, req);

    res.json({ success: true, message: 'Service updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PATCH /api/admin/pricing/:id/toggle
 * Toggle service active/inactive
 */
router.patch('/:id/toggle', (req, res) => {
  try {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found.' });
    }

    const nextState = service.is_active ? 0 : 1;
    db.prepare('UPDATE services SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(nextState, service.id);

    logAudit(req.admin.username, 'TOGGLE_SERVICE', 'SERVICE', service.id, `Set is_active = ${nextState} for ${service.name}`, req);

    res.json({
      success: true,
      message: `Service "${service.name}" is now ${nextState ? 'Active' : 'Inactive'}.`,
      is_active: nextState
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
