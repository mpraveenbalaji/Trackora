/**
 * Trackora - User Routes (sql.js compatible)
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/init');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authenticateToken);

function nowISO() { return new Date().toISOString().replace('T', ' ').split('.')[0]; }
function fmtUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role, territory: u.territory, phone: u.phone, avatarText: u.avatar_text, isActive: u.is_active === 1, createdAt: u.created_at, updatedAt: u.updated_at };
}

// ─── GET /api/users ───────────────────────────────────────────────────────────
router.get('/', requireRole('manager', 'admin'), (req, res) => {
  try {
    const db = getDb();
    const { role, isActive } = req.query;
    let sql = 'SELECT id, name, email, role, territory, phone, avatar_text, is_active, created_at, updated_at FROM users WHERE 1=1';
    const params = [];
    if (role) { sql += ' AND role = ?'; params.push(role); }
    if (isActive !== undefined) { sql += ' AND is_active = ?'; params.push(isActive === 'true' ? 1 : 0); }
    const users = db.all(sql, params);
    return res.json({ success: true, data: users.map(fmtUser) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/users/me/profile ────────────────────────────────────────────────
router.get('/me/profile', (req, res) => {
  try {
    const db = getDb();
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.slice(0, 7);
    const user = db.get('SELECT id, name, email, role, territory, phone, avatar_text, is_active, created_at FROM users WHERE id = ?', [req.user.id]);
    const visitCount = db.get('SELECT COUNT(*) as count FROM visits WHERE user_id = ? AND visit_date LIKE ?', [req.user.id, `${currentMonth}%`]);
    const pipeline = db.get('SELECT COALESCE(SUM(deal_amount), 0) as total FROM visits WHERE user_id = ? AND visit_date LIKE ?', [req.user.id, `${currentMonth}%`]);
    const target = db.get('SELECT * FROM targets WHERE user_id = ? AND month = ?', [req.user.id, currentMonth]);
    return res.json({
      success: true,
      data: {
        ...fmtUser(user),
        stats: { monthlyVisits: visitCount.count, monthlyPipeline: pipeline.total, visitTarget: target?.visit_target || 6, revenueTarget: target?.revenue_target || 5000000 },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    if (req.user.role === 'sales_rep' && req.params.id !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied.' });
    const user = db.get('SELECT id, name, email, role, territory, phone, avatar_text, is_active, created_at, updated_at FROM users WHERE id = ?', [req.params.id]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({ success: true, data: fmtUser(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/users ──────────────────────────────────────────────────────────
router.post('/', requireRole('admin'), [
  body('name').notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['sales_rep', 'manager', 'admin']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const db = getDb();
    const { name, email, password, role, territory, phone } = req.body;
    if (db.get('SELECT id FROM users WHERE email = ?', [email]))
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    const hashed = await bcrypt.hash(password, 10);
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const userId = uuidv4();
    const ts = nowISO();
    db.run('INSERT INTO users (id, name, email, password, role, territory, phone, avatar_text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashed, role, territory || null, phone || null, initials, ts, ts]);
    const created = db.get('SELECT id, name, email, role, territory, phone, avatar_text, is_active, created_at FROM users WHERE id = ?', [userId]);
    return res.status(201).json({ success: true, data: fmtUser(created) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PATCH /api/users/:id ─────────────────────────────────────────────────────
router.patch('/:id', (req, res) => {
  try {
    const db = getDb();
    if (req.user.role === 'sales_rep' && req.params.id !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied.' });
    const allowed = { name: 'name', territory: 'territory', phone: 'phone' };
    if (req.user.role === 'admin') { allowed.role = 'role'; allowed.isActive = 'is_active'; }
    const updates = ['updated_at = ?'];
    const values = [nowISO()];
    for (const [key, col] of Object.entries(allowed)) {
      if (req.body[key] !== undefined) { updates.push(`${col} = ?`); values.push(key === 'isActive' ? (req.body[key] ? 1 : 0) : req.body[key]); }
    }
    if (updates.length === 1) return res.status(400).json({ success: false, message: 'No valid fields.' });
    values.push(req.params.id);
    db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    const updated = db.get('SELECT id, name, email, role, territory, phone, avatar_text, is_active, created_at, updated_at FROM users WHERE id = ?', [req.params.id]);
    return res.json({ success: true, data: fmtUser(updated) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
router.delete('/:id', requireRole('admin'), (req, res) => {
  try {
    const db = getDb();
    if (req.params.id === req.user.id)
      return res.status(400).json({ success: false, message: 'Cannot deactivate yourself.' });
    db.run('UPDATE users SET is_active = 0, updated_at = ? WHERE id = ?', [nowISO(), req.params.id]);
    return res.json({ success: true, message: 'User deactivated.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/users/:id/visits ────────────────────────────────────────────────
router.get('/:id/visits', (req, res) => {
  try {
    const db = getDb();
    if (req.user.role === 'sales_rep' && req.params.id !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied.' });
    const { limit = 20, offset = 0 } = req.query;
    const visits = db.all('SELECT * FROM visits WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?', [req.params.id, parseInt(limit), parseInt(offset)]);
    return res.json({ success: true, data: visits });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
