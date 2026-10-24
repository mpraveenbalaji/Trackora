/**
 * Trackora - Admin Routes (sql.js compatible)
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/init');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authenticateToken, requireRole('manager', 'admin'));

function nowISO() { return new Date().toISOString().replace('T', ' ').split('.')[0]; }
function todayStr() { return new Date().toISOString().split('T')[0]; }

// ─── GET /api/admin/overview ──────────────────────────────────────────────────
router.get('/overview', (req, res) => {
  try {
    const db = getDb();
    const today = todayStr();
    const currentMonth = today.slice(0, 7);

    const stats = {
      totalUsers: db.get('SELECT COUNT(*) as c FROM users WHERE is_active = 1').c,
      totalSalesReps: db.get('SELECT COUNT(*) as c FROM users WHERE role = "sales_rep" AND is_active = 1').c,
      checkedInToday: db.get('SELECT COUNT(*) as c FROM attendance WHERE date = ? AND status = "checked_in"', [today]).c,
      totalVisitsToday: db.get('SELECT COUNT(*) as c FROM visits WHERE visit_date = ?', [today]).c,
      pendingApprovals: db.get('SELECT COUNT(*) as c FROM visits WHERE status = "pending"').c,
      approvedThisMonth: db.get('SELECT COUNT(*) as c FROM visits WHERE status = "approved" AND visit_date LIKE ?', [`${currentMonth}%`]).c,
      totalPipelineThisMonth: db.get('SELECT COALESCE(SUM(deal_amount), 0) as t FROM visits WHERE visit_date LIKE ? AND status = "approved"', [`${currentMonth}%`]).t,
      hotLeadsActive: db.get('SELECT COUNT(*) as c FROM visits WHERE is_hot_lead = 1 AND status != "rejected"').c,
    };

    const pendingVisits = db.all(`
      SELECT v.*, u.name as rep_name, u.territory
      FROM visits v LEFT JOIN users u ON v.user_id = u.id
      WHERE v.status = 'pending' ORDER BY v.created_at DESC LIMIT 10
    `, []);

    return res.json({ success: true, data: { stats, pendingVisits, asOf: new Date().toISOString() } });
  } catch (err) {
    console.error('Admin overview error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/pending-visits ───────────────────────────────────────────
router.get('/pending-visits', (req, res) => {
  try {
    const db = getDb();
    const { limit = 50, offset = 0 } = req.query;
    const visits = db.all(`
      SELECT v.*, u.name as rep_name, u.territory, u.avatar_text
      FROM visits v LEFT JOIN users u ON v.user_id = u.id
      WHERE v.status = 'pending' ORDER BY v.created_at ASC LIMIT ? OFFSET ?
    `, [parseInt(limit), parseInt(offset)]);
    const total = db.get('SELECT COUNT(*) as count FROM visits WHERE status = "pending"');
    return res.json({
      success: true,
      data: visits.map(v => ({
        id: v.id, repName: v.rep_name, repTerritory: v.territory, avatarText: v.avatar_text,
        clientName: v.client_name, contactPerson: v.contact_person, phone: v.phone,
        state: v.state, area: v.area, lat: v.lat, lng: v.lng,
        dealAmount: v.deal_amount, meetingType: v.meeting_type, notes: v.notes,
        hasPhoto: v.has_photo === 1, hasAudio: v.has_audio === 1, isHotLead: v.is_hot_lead === 1,
        visitDate: v.visit_date, visitTime: v.visit_time, createdAt: v.created_at,
      })),
      total: total.count,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
router.get('/users', (req, res) => {
  try {
    const db = getDb();
    const currentMonth = todayStr().slice(0, 7);
    const users = db.all(`
      SELECT u.id, u.name, u.email, u.role, u.territory, u.phone, u.avatar_text, u.is_active, u.created_at,
        COUNT(v.id) as visit_count, COALESCE(SUM(v.deal_amount), 0) as pipeline,
        COUNT(CASE WHEN v.status = 'approved' THEN 1 ELSE NULL END) as approved_count
      FROM users u LEFT JOIN visits v ON u.id = v.user_id AND v.visit_date LIKE ?
      WHERE u.role != 'admin' GROUP BY u.id ORDER BY pipeline DESC
    `, [`${currentMonth}%`]);
    return res.json({
      success: true,
      data: users.map(u => ({
        id: u.id, name: u.name, email: u.email, role: u.role, territory: u.territory,
        phone: u.phone, avatarText: u.avatar_text, isActive: u.is_active === 1, createdAt: u.created_at,
        monthlyStats: { visitCount: u.visit_count, pipeline: u.pipeline, approvedCount: u.approved_count },
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/reports ───────────────────────────────────────────────────
router.get('/reports', (req, res) => {
  try {
    const db = getDb();
    const reportMonth = req.query.month || todayStr().slice(0, 7);
    const repSummary = db.all(`
      SELECT u.name, u.territory, u.avatar_text,
        COUNT(v.id) as total_visits,
        COUNT(CASE WHEN v.status = 'approved' THEN 1 ELSE NULL END) as approved,
        COUNT(CASE WHEN v.status = 'pending' THEN 1 ELSE NULL END) as pending,
        COUNT(CASE WHEN v.status = 'rejected' THEN 1 ELSE NULL END) as rejected,
        COALESCE(SUM(v.deal_amount), 0) as total_pipeline,
        COUNT(CASE WHEN v.is_hot_lead = 1 THEN 1 ELSE NULL END) as hot_leads,
        COUNT(CASE WHEN v.has_photo = 1 THEN 1 ELSE NULL END) as with_photo,
        COUNT(CASE WHEN v.has_audio = 1 THEN 1 ELSE NULL END) as with_audio
      FROM users u LEFT JOIN visits v ON u.id = v.user_id AND v.visit_date LIKE ?
      WHERE u.role = 'sales_rep' AND u.is_active = 1
      GROUP BY u.id ORDER BY total_pipeline DESC
    `, [`${reportMonth}%`]);
    const byMeetingType = db.all('SELECT meeting_type, COUNT(*) as count, COALESCE(SUM(deal_amount), 0) as total FROM visits WHERE visit_date LIKE ? GROUP BY meeting_type', [`${reportMonth}%`]);
    const byState = db.all('SELECT state, COUNT(*) as count, COALESCE(SUM(deal_amount), 0) as pipeline FROM visits WHERE visit_date LIKE ? AND state IS NOT NULL GROUP BY state ORDER BY pipeline DESC', [`${reportMonth}%`]);
    return res.json({ success: true, data: { month: reportMonth, repSummary, byMeetingType, byState, generatedAt: new Date().toISOString() } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/clients ───────────────────────────────────────────────────
router.get('/clients', (req, res) => {
  try {
    const db = getDb();
    const clients = db.all('SELECT * FROM clients WHERE is_active = 1 ORDER BY name', []);
    return res.json({ success: true, data: clients });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/admin/clients ──────────────────────────────────────────────────
router.post('/clients', [
  body('name').notEmpty(),
  body('state').notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const db = getDb();
    const { name, contactName, phone, state, area, lat, lng } = req.body;
    const clientId = uuidv4();
    const ts = nowISO();
    db.run('INSERT INTO clients (id, name, contact_name, phone, state, area, lat, lng, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [clientId, name, contactName || null, phone || null, state, area || null, lat || null, lng || null, req.user.id, ts]);
    const created = db.get('SELECT * FROM clients WHERE id = ?', [clientId]);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/admin/targets ───────────────────────────────────────────────────
router.get('/targets', (req, res) => {
  try {
    const db = getDb();
    const targetMonth = req.query.month || todayStr().slice(0, 7);
    const targets = db.all('SELECT t.*, u.name, u.territory, u.avatar_text FROM targets t LEFT JOIN users u ON t.user_id = u.id WHERE t.month = ?', [targetMonth]);
    return res.json({ success: true, data: targets });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/admin/targets ──────────────────────────────────────────────────
router.post('/targets', [
  body('userId').notEmpty(),
  body('month').matches(/^\d{4}-\d{2}$/),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const db = getDb();
    const { userId, month, visitTarget = 6, revenueTarget = 5000000 } = req.body;
    const existing = db.get('SELECT * FROM targets WHERE user_id = ? AND month = ?', [userId, month]);
    if (existing) {
      db.run('UPDATE targets SET visit_target = ?, revenue_target = ? WHERE id = ?', [visitTarget, revenueTarget, existing.id]);
    } else {
      db.run('INSERT INTO targets (id, user_id, month, visit_target, revenue_target, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [uuidv4(), userId, month, visitTarget, revenueTarget, nowISO()]);
    }
    return res.json({ success: true, message: 'Target updated.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
