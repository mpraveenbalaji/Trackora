/**
 * Trackora - Attendance Routes (sql.js compatible)
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/init');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authenticateToken);

function nowISO() { return new Date().toISOString().replace('T', ' ').split('.')[0]; }
function todayStr() { return new Date().toISOString().split('T')[0]; }

function formatAtt(a) {
  return {
    id: a.id, userId: a.user_id, userName: a.user_name || null,
    date: a.date, checkInTime: a.check_in_time, checkOutTime: a.check_out_time,
    checkInLat: a.check_in_lat, checkInLng: a.check_in_lng,
    checkOutLat: a.check_out_lat, checkOutLng: a.check_out_lng,
    locationLabel: a.location_label, accuracyMeters: a.accuracy_meters,
    status: a.status, createdAt: a.created_at,
  };
}

// ─── GET /api/attendance/today ────────────────────────────────────────────────
router.get('/today', (req, res) => {
  try {
    const db = getDb();
    const record = db.get(
      'SELECT a.*, u.name as user_name FROM attendance a LEFT JOIN users u ON a.user_id = u.id WHERE a.user_id = ? AND a.date = ?',
      [req.user.id, todayStr()]
    );
    return res.json({
      success: true,
      data: record ? formatAtt(record) : null,
      isCheckedIn: !!record && record.status === 'checked_in',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/attendance/checkin ─────────────────────────────────────────────
router.post('/checkin', [
  body('lat').optional().isFloat(),
  body('lng').optional().isFloat(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const db = getDb();
    const today = todayStr();
    const now = nowISO();
    const existing = db.get('SELECT * FROM attendance WHERE user_id = ? AND date = ?', [req.user.id, today]);

    if (existing && existing.status === 'checked_in') {
      return res.status(400).json({ success: false, message: 'Already checked in today.', data: formatAtt({ ...existing, user_name: req.user.name }) });
    }

    const { lat, lng, locationLabel, accuracyMeters = 3.0 } = req.body;

    if (existing) {
      db.run(`UPDATE attendance SET check_in_time = ?, check_in_lat = ?, check_in_lng = ?, location_label = ?, accuracy_meters = ?, status = 'checked_in', updated_at = ? WHERE id = ?`,
        [now, lat || null, lng || null, locationLabel || 'GPS Verified', accuracyMeters, now, existing.id]);
    } else {
      db.run(`INSERT INTO attendance (id, user_id, date, check_in_time, check_in_lat, check_in_lng, location_label, accuracy_meters, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'checked_in', ?, ?)`,
        [uuidv4(), req.user.id, today, now, lat || null, lng || null, locationLabel || 'GPS Verified', accuracyMeters, now, now]);
    }

    const updated = db.get(
      'SELECT a.*, u.name as user_name FROM attendance a LEFT JOIN users u ON a.user_id = u.id WHERE a.user_id = ? AND a.date = ?',
      [req.user.id, today]
    );
    return res.json({ success: true, message: 'Checked in successfully!', data: formatAtt(updated) });
  } catch (err) {
    console.error('Check-in error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PATCH /api/attendance/checkout ──────────────────────────────────────────
router.patch('/checkout', (req, res) => {
  try {
    const db = getDb();
    const today = todayStr();
    const existing = db.get('SELECT * FROM attendance WHERE user_id = ? AND date = ?', [req.user.id, today]);

    if (!existing || existing.status !== 'checked_in') {
      return res.status(400).json({ success: false, message: 'No active check-in found for today.' });
    }

    const { lat, lng } = req.body;
    const now = nowISO();
    db.run(`UPDATE attendance SET check_out_time = ?, check_out_lat = ?, check_out_lng = ?, status = 'checked_out', updated_at = ? WHERE id = ?`,
      [now, lat || null, lng || null, now, existing.id]);

    return res.json({ success: true, message: 'Checked out successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/attendance/history ─────────────────────────────────────────────
router.get('/history', (req, res) => {
  try {
    const db = getDb();
    const { limit = 30, offset = 0 } = req.query;
    let userId = req.user.id;
    if ((req.user.role === 'manager' || req.user.role === 'admin') && req.query.userId) {
      userId = req.query.userId;
    }
    const records = db.all(
      'SELECT a.*, u.name as user_name FROM attendance a LEFT JOIN users u ON a.user_id = u.id WHERE a.user_id = ? ORDER BY a.date DESC LIMIT ? OFFSET ?',
      [userId, parseInt(limit), parseInt(offset)]
    );
    return res.json({ success: true, data: records.map(formatAtt) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/attendance (all, manager/admin) ─────────────────────────────────
router.get('/', requireRole('manager', 'admin'), (req, res) => {
  try {
    const db = getDb();
    const { date, limit = 50, offset = 0 } = req.query;
    let sql = 'SELECT a.*, u.name as user_name, u.territory as user_territory FROM attendance a LEFT JOIN users u ON a.user_id = u.id WHERE 1=1';
    const params = [];
    if (date) { sql += ' AND a.date = ?'; params.push(date); }
    sql += ' ORDER BY a.date DESC, a.check_in_time ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const records = db.all(sql, params);
    return res.json({ success: true, data: records.map(r => ({ ...formatAtt(r), userTerritory: r.user_territory })) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
