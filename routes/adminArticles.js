const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../database/db');
const { requireAdmin } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

router.use(requireAdmin);

// Storage for article featured images
const uploadDir = path.join(__dirname, '..', 'public', 'images', 'articles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `article-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
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

function generateSlug(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0980-\u09FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * GET /api/admin/articles
 * List all articles with optional status and search filter
 */
router.get('/', (req, res) => {
  try {
    const { status, q } = req.query;
    let query = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (q && q.trim()) {
      query += ' AND (title_bn LIKE ? OR title_en LIKE ? OR excerpt_bn LIKE ? OR excerpt_en LIKE ?)';
      const term = `%${q.trim()}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY published_at DESC, id DESC';

    const articles = db.prepare(query).all(...params);
    res.json({ success: true, count: articles.length, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/articles/:id
 * Retrieve a single article
 */
router.get('/:id', (req, res) => {
  try {
    const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found.' });
    }
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/articles
 * Create new article or case history
 */
router.post('/', (req, res) => {
  try {
    const {
      title_bn,
      title_en,
      slug_bn,
      slug_en,
      category_bn,
      category_en,
      excerpt_bn,
      excerpt_en,
      content_bn,
      content_en,
      featured_image,
      status = 'published',
      author_name
    } = req.body;

    if (!title_bn || !title_bn.trim()) {
      return res.status(400).json({ success: false, error: 'Bengali title (title_bn) is required.' });
    }
    if (!content_bn || !content_bn.trim()) {
      return res.status(400).json({ success: false, error: 'Bengali content (content_bn) is required.' });
    }

    // Patient Privacy / Anonymization Check Warning
    const combinedContent = `${title_bn} ${title_en || ''} ${content_bn} ${content_en || ''}`;
    const phonePattern = /(?:\+88|88)?01[3-9]\d{8}/;
    if (phonePattern.test(combinedContent)) {
      return res.status(400).json({
        success: false,
        error: 'Privacy Violation: The case history appears to contain a real phone number. Patient confidentiality requires complete anonymization of all phone numbers, national IDs, and specific private addresses.'
      });
    }

    const finalSlugBn = (slug_bn && slug_bn.trim()) ? generateSlug(slug_bn) : generateSlug(title_bn) || `case-bn-${Date.now()}`;
    const finalSlugEn = (slug_en && slug_en.trim()) ? generateSlug(slug_en) : (title_en ? generateSlug(title_en) : `case-en-${Date.now()}`);

    // Check unique slugs
    const existing = db.prepare('SELECT id FROM articles WHERE slug_bn = ? OR slug_en = ?').get(finalSlugBn, finalSlugEn);
    if (existing) {
      return res.status(400).json({ success: false, error: 'An article with the same slug already exists. Please choose a unique slug.' });
    }

    const result = db.prepare(`
      INSERT INTO articles (
        title_bn, title_en, slug_bn, slug_en, category_bn, category_en,
        excerpt_bn, excerpt_en, content_bn, content_en, featured_image,
        status, author_name, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      title_bn.trim(),
      (title_en || title_bn).trim(),
      finalSlugBn,
      finalSlugEn,
      category_bn ? category_bn.trim() : 'কেস স্টাডি ও আরোগ্য বিবরণ',
      category_en ? category_en.trim() : 'Case Study & Healing Record',
      excerpt_bn ? excerpt_bn.trim() : content_bn.slice(0, 160).trim(),
      excerpt_en ? excerpt_en.trim() : (content_en ? content_en.slice(0, 160).trim() : ''),
      content_bn.trim(),
      (content_en || '').trim(),
      featured_image ? featured_image.trim() : '/images/articles/default-case.jpg',
      status === 'draft' ? 'draft' : 'published',
      author_name ? author_name.trim() : 'মুহাম্মদুল্লাহ মিয়াহ (Muhammadullah Miah)'
    );

    logAudit(req.admin.username, 'CREATE_ARTICLE', 'ARTICLE', String(result.lastInsertRowid), `Created article: ${title_bn}`, req);

    res.json({
      success: true,
      message: 'Article / Case History published successfully.',
      article_id: result.lastInsertRowid
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/articles/:id
 * Update an existing article
 */
router.put('/:id', (req, res) => {
  try {
    const articleId = req.params.id;
    const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(articleId);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Article not found.' });
    }

    const {
      title_bn,
      title_en,
      slug_bn,
      slug_en,
      category_bn,
      category_en,
      excerpt_bn,
      excerpt_en,
      content_bn,
      content_en,
      featured_image,
      status,
      author_name
    } = req.body;

    // Check privacy
    const combinedContent = `${title_bn || ''} ${title_en || ''} ${content_bn || ''} ${content_en || ''}`;
    const phonePattern = /(?:\+88|88)?01[3-9]\d{8}/;
    if (phonePattern.test(combinedContent)) {
      return res.status(400).json({
        success: false,
        error: 'Privacy Violation: The case history appears to contain a real phone number. Patient confidentiality requires complete anonymization.'
      });
    }

    const finalSlugBn = slug_bn ? generateSlug(slug_bn) : existing.slug_bn;
    const finalSlugEn = slug_en ? generateSlug(slug_en) : existing.slug_en;

    // Verify slug uniqueness against other articles
    const conflict = db.prepare('SELECT id FROM articles WHERE (slug_bn = ? OR slug_en = ?) AND id != ?').get(finalSlugBn, finalSlugEn, articleId);
    if (conflict) {
      return res.status(400).json({ success: false, error: 'Another article already uses this slug.' });
    }

    db.prepare(`
      UPDATE articles
      SET 
        title_bn = COALESCE(?, title_bn),
        title_en = COALESCE(?, title_en),
        slug_bn = ?,
        slug_en = ?,
        category_bn = COALESCE(?, category_bn),
        category_en = COALESCE(?, category_en),
        excerpt_bn = COALESCE(?, excerpt_bn),
        excerpt_en = COALESCE(?, excerpt_en),
        content_bn = COALESCE(?, content_bn),
        content_en = COALESCE(?, content_en),
        featured_image = COALESCE(?, featured_image),
        status = COALESCE(?, status),
        author_name = COALESCE(?, author_name),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title_bn ? title_bn.trim() : null,
      title_en ? title_en.trim() : null,
      finalSlugBn,
      finalSlugEn,
      category_bn ? category_bn.trim() : null,
      category_en ? category_en.trim() : null,
      excerpt_bn ? excerpt_bn.trim() : null,
      excerpt_en ? excerpt_en.trim() : null,
      content_bn ? content_bn.trim() : null,
      content_en ? content_en.trim() : null,
      featured_image ? featured_image.trim() : null,
      status ? status.trim() : null,
      author_name ? author_name.trim() : null,
      articleId
    );

    logAudit(req.admin.username, 'UPDATE_ARTICLE', 'ARTICLE', String(articleId), `Updated article: ${title_bn || existing.title_bn}`, req);

    res.json({ success: true, message: 'Article updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/articles/:id/status
 * Quick toggle status (published / draft)
 */
router.put('/:id/status', (req, res) => {
  try {
    const articleId = req.params.id;
    const { status } = req.body;
    if (!['published', 'draft'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status. Must be "published" or "draft".' });
    }

    db.prepare('UPDATE articles SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, articleId);
    logAudit(req.admin.username, 'UPDATE_ARTICLE_STATUS', 'ARTICLE', String(articleId), `Changed status to ${status}`, req);

    res.json({ success: true, message: `Article status updated to ${status}.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/admin/articles/:id
 * Delete an article
 */
router.delete('/:id', (req, res) => {
  try {
    const articleId = req.params.id;
    const article = db.prepare('SELECT title_bn FROM articles WHERE id = ?').get(articleId);
    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found.' });
    }

    db.prepare('DELETE FROM articles WHERE id = ?').run(articleId);
    logAudit(req.admin.username, 'DELETE_ARTICLE', 'ARTICLE', String(articleId), `Deleted article: ${article.title_bn}`, req);

    res.json({ success: true, message: 'Article deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/articles/upload-image
 * Upload article featured image
 */
router.post('/upload-image', (req, res) => {
  upload.single('image')(req, res, err => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file uploaded.' });
    }
    const imageUrl = `/images/articles/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Image uploaded successfully.',
      url: imageUrl
    });
  });
});

module.exports = router;
