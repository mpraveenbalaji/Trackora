/**
 * Trackora - Visit Routes (sql.js compatible)
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database/init');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authenticateToken);

function nowISO() { return new Date().toISOString().replace('T', ' ').split('.')[0]; }

function formatVisit(v) {
  return {
    id: v.id,
    userId: v.user_id,
    repName: v.rep_name || null,
    repTerritory: v.rep_territory || null,
    clientName: v.client_name,
    contactPerson: v.contact_person,
    phone: v.phone,
    state: v.state,
    area: v.area,
    lat: v.lat,
    lng: v.lng,
    dealAmount: v.deal_amount,
    meetingType: v.meeting_type,
    notes: v.notes,
    hasPhoto: v.has_photo === 1,
    hasAudio: v.has_audio === 1,
    photoUrl: v.photo_url,
    audioUrl: v.audio_url,
    status: v.status,
    isHotLead: v.is_hot_lead === 1,
    approvedBy: v.approved_by,
    approvedAt: v.approved_at,
    rejectionNote: v.rejection_note,
    visitDate: v.visit_date,
    visitTime: v.visit_time,
    createdAt: v.created_at,
    updatedAt: v.updated_at,
  };
}

// ─── GET /api/visits ──────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { status, date, limit = 50, offset = 0, userId } = req.query;

    let sql = `
      SELECT v.*, u.name as rep_name, u.territory as rep_territory
      FROM visits v LEFT JOIN users u ON v.user_id = u.id WHERE 1=1
    `;
    const params = [];

    if (req.user.role === 'sales_rep') {
      sql += ' AND v.user_id = ?'; params.push(req.user.id);
    } else if (userId) {
      sql += ' AND v.user_id = ?'; params.push(userId);
    }
    if (status) { sql += ' AND v.status = ?'; params.push(status); }
    if (date) { sql += ' AND v.visit_date = ?'; params.push(date); }
    sql += ' ORDER BY v.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const visits = db.all(sql, params);
    return res.json({ success: true, data: visits.map(formatVisit) });
  } catch (err) {
    console.error('Get visits error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/visits/:id ──────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const visit = db.get(
      'SELECT v.*, u.name as rep_name, u.territory as rep_territory FROM visits v LEFT JOIN users u ON v.user_id = u.id WHERE v.id = ?',
      [req.params.id]
    );
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found.' });
    if (req.user.role === 'sales_rep' && visit.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    return res.json({ success: true, data: formatVisit(visit) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/visits ─────────────────────────────────────────────────────────
router.post('/', [
  body('clientName').notEmpty().withMessage('Client name required'),
  body('state').notEmpty().withMessage('State required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const db = getDb();
    const {
      clientName, contactPerson, phone, state, area,
      lat, lng, dealAmount = 0, meetingType = 'In-Person',
      notes, hasPhoto = false, hasAudio = false,
      isHotLead = false, visitDate, visitTime,
    } = req.body;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeStr = visitTime || `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const visitId = uuidv4();
    const ts = nowISO();

    db.run(`INSERT INTO visits (id, user_id, client_name, contact_person, phone, state, area, lat, lng,
      deal_amount, meeting_type, notes, has_photo, has_audio, status, is_hot_lead, visit_date, visit_time, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)`,
      [visitId, req.user.id, clientName, contactPerson || null, phone || null, state, area || null,
       lat || null, lng || null, dealAmount, meetingType, notes || null,
       hasPhoto ? 1 : 0, hasAudio ? 1 : 0, isHotLead ? 1 : 0,
       visitDate || today, timeStr, ts, ts]);

    const created = db.get(
      'SELECT v.*, u.name as rep_name, u.territory as rep_territory FROM visits v LEFT JOIN users u ON v.user_id = u.id WHERE v.id = ?',
      [visitId]
    );
    return res.status(201).json({ success: true, message: 'Visit logged and submitted for approval.', data: formatVisit(created) });
  } catch (err) {
    console.error('Create visit error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PATCH /api/visits/:id ────────────────────────────────────────────────────
router.patch('/:id', (req, res) => {
  try {
    const db = getDb();
    const visit = db.get('SELECT * FROM visits WHERE id = ?', [req.params.id]);
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found.' });
    if (req.user.role === 'sales_rep' && visit.user_id !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied.' });
    if (req.user.role === 'sales_rep' && visit.status === 'approved')
      return res.status(400).json({ success: false, message: 'Cannot edit an approved visit.' });

    const fieldMap = {
      clientName: 'client_name', contactPerson: 'contact_person', phone: 'phone',
      state: 'state', area: 'area', lat: 'lat', lng: 'lng',
      dealAmount: 'deal_amount', meetingType: 'meeting_type', notes: 'notes',
      hasPhoto: 'has_photo', hasAudio: 'has_audio', isHotLead: 'is_hot_lead',
      visitDate: 'visit_date', visitTime: 'visit_time',
    };

    const updates = ['updated_at = ?'];
    const values = [nowISO()];

    for (const [key, col] of Object.entries(fieldMap)) {
      if (req.body[key] !== undefined) {
        updates.push(`${col} = ?`);
        values.push(typeof req.body[key] === 'boolean' ? (req.body[key] ? 1 : 0) : req.body[key]);
      }
    }

    values.push(req.params.id);
    db.run(`UPDATE visits SET ${updates.join(', ')} WHERE id = ?`, values);
    const updated = db.get(
      'SELECT v.*, u.name as rep_name, u.territory as rep_territory FROM visits v LEFT JOIN users u ON v.user_id = u.id WHERE v.id = ?',
      [req.params.id]
    );
    return res.json({ success: true, data: formatVisit(updated) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PATCH /api/visits/:id/approve ───────────────────────────────────────────
router.patch('/:id/approve', requireRole('manager', 'admin'), (req, res) => {
  try {
    const db = getDb();
    const visit = db.get('SELECT * FROM visits WHERE id = ?', [req.params.id]);
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found.' });
    if (visit.status === 'approved') return res.status(400).json({ success: false, message: 'Already approved.' });

    db.run(`UPDATE visits SET status = 'approved', approved_by = ?, approved_at = ?, updated_at = ? WHERE id = ?`,
      [req.user.id, nowISO(), nowISO(), req.params.id]);

    db.run(`INSERT INTO notifications (id, user_id, type, title, message, ref_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), visit.user_id, 'visit_approved', 'Visit Approved ✅',
       `Your visit to "${visit.client_name}" has been approved by ${req.user.name}.`, visit.id, nowISO()]);

    return res.json({ success: true, message: `Visit to "${visit.client_name}" approved.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PATCH /api/visits/:id/reject ────────────────────────────────────────────
router.patch('/:id/reject', requireRole('manager', 'admin'), (req, res) => {
  try {
    const db = getDb();
    const visit = db.get('SELECT * FROM visits WHERE id = ?', [req.params.id]);
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found.' });

    const { rejectionNote } = req.body;
    db.run(`UPDATE visits SET status = 'rejected', rejection_note = ?, approved_by = ?, updated_at = ? WHERE id = ?`,
      [rejectionNote || 'No reason specified', req.user.id, nowISO(), req.params.id]);

    db.run(`INSERT INTO notifications (id, user_id, type, title, message, ref_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), visit.user_id, 'visit_rejected', 'Visit Flagged ⚠️',
       `Your visit to "${visit.client_name}" was flagged: ${rejectionNote || 'Please review.'}`, visit.id, nowISO()]);

    return res.json({ success: true, message: 'Visit rejected.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── DELETE /api/visits/:id ───────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    const visit = db.get('SELECT * FROM visits WHERE id = ?', [req.params.id]);
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found.' });
    if (req.user.role === 'sales_rep' && visit.user_id !== req.user.id)
      return res.status(403).json({ success: false, message: 'Access denied.' });
    db.run('DELETE FROM visits WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Visit deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
