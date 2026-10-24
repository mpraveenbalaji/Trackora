/**
 * Trackora - Dashboard Routes (sql.js compatible)
 */
const express = require('express');
const { getDb } = require('../database/init');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authenticateToken);

function todayStr() { return new Date().toISOString().split('T')[0]; }

// ─── GET /api/dashboard/summary ──────────────────────────────────────────────
router.get('/summary', (req, res) => {
  try {
    const db = getDb();
    const today = todayStr();
    const currentMonth = today.slice(0, 7);
    const uid = req.user.id;

    const todayVisits = db.get('SELECT COUNT(*) as count FROM visits WHERE user_id = ? AND visit_date = ?', [uid, today]);
    const monthPipeline = db.get('SELECT COALESCE(SUM(deal_amount), 0) as total FROM visits WHERE user_id = ? AND visit_date LIKE ?', [uid, `${currentMonth}%`]);
    const hotLeads = db.get('SELECT COUNT(*) as count FROM visits WHERE user_id = ? AND is_hot_lead = 1 AND status != "rejected"', [uid]);
    const pendingCount = db.get('SELECT COUNT(*) as count FROM visits WHERE user_id = ? AND status = "pending"', [uid]);
    const approvedCount = db.get('SELECT COUNT(*) as count FROM visits WHERE user_id = ? AND status = "approved" AND visit_date LIKE ?', [uid, `${currentMonth}%`]);
    const target = db.get('SELECT * FROM targets WHERE user_id = ? AND month = ?', [uid, currentMonth]);
    const todayAtt = db.get('SELECT * FROM attendance WHERE user_id = ? AND date = ?', [uid, today]);

    const visitTarget = target ? target.visit_target : 6;
    const revenueTarget = target ? target.revenue_target : 5000000;

    return res.json({
      success: true,
      data: {
        today: {
          date: today,
          visitsLogged: todayVisits.count,
          visitTarget,
          visitAchievement: `${Math.min(100, Math.round((todayVisits.count / visitTarget) * 100))}%`,
          isCheckedIn: !!todayAtt && todayAtt.status === 'checked_in',
          checkInTime: todayAtt ? todayAtt.check_in_time : null,
          checkInLocation: todayAtt ? todayAtt.location_label : null,
        },
        monthly: {
          month: currentMonth,
          pipelineTotal: monthPipeline.total,
          revenueTarget,
          revenueAchievement: `${Math.min(100, Math.round((monthPipeline.total / revenueTarget) * 100))}%`,
          approvedVisits: approvedCount.count,
          pendingVisits: pendingCount.count,
        },
        hotLeadsActive: hotLeads.count,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('Dashboard summary error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/dashboard/stats ─────────────────────────────────────────────────
router.get('/stats', requireRole('manager', 'admin'), (req, res) => {
  try {
    const db = getDb();
    const today = todayStr();
    const currentMonth = today.slice(0, 7);

    const totalReps = db.get('SELECT COUNT(*) as count FROM users WHERE role = "sales_rep" AND is_active = 1');
    const checkedIn = db.get('SELECT COUNT(*) as count FROM attendance WHERE date = ? AND status = "checked_in"', [today]);
    const visitsToday = db.get('SELECT COUNT(*) as count FROM visits WHERE visit_date = ?', [today]);
    const pending = db.get('SELECT COUNT(*) as count FROM visits WHERE status = "pending"');
    const monthRevenue = db.get('SELECT COALESCE(SUM(deal_amount), 0) as total FROM visits WHERE visit_date LIKE ? AND status = "approved"', [`${currentMonth}%`]);
    const visitsByStatus = db.all('SELECT status, COUNT(*) as count FROM visits WHERE visit_date = ? GROUP BY status', [today]);
    const topReps = db.all(`
      SELECT u.name, u.territory, u.avatar_text,
        COUNT(v.id) as visit_count, COALESCE(SUM(v.deal_amount), 0) as pipeline
      FROM users u LEFT JOIN visits v ON u.id = v.user_id AND v.visit_date LIKE ?
      WHERE u.role = 'sales_rep' AND u.is_active = 1
      GROUP BY u.id ORDER BY pipeline DESC LIMIT 10
    `, [`${currentMonth}%`]);

    return res.json({
      success: true,
      data: {
        overview: {
          totalActiveSalesReps: totalReps.count,
          checkedInToday: checkedIn.count,
          totalVisitsToday: visitsToday.count,
          pendingApprovals: pending.count,
          monthlyApprovedRevenue: monthRevenue.total,
        },
        visitsByStatus: Object.fromEntries(visitsByStatus.map(v => [v.status, v.count])),
        topReps: topReps.map(r => ({ name: r.name, territory: r.territory, avatarText: r.avatar_text, visitCount: r.visit_count, pipeline: r.pipeline })),
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/dashboard/leaderboard ──────────────────────────────────────────
router.get('/leaderboard', (req, res) => {
  try {
    const db = getDb();
    const currentMonth = todayStr().slice(0, 7);

    const leaderboard = db.all(`
      SELECT u.id, u.name, u.territory, u.avatar_text,
        COUNT(v.id) as total_visits,
        COALESCE(SUM(v.deal_amount), 0) as total_pipeline,
        COUNT(CASE WHEN v.status = 'approved' THEN 1 END) as approved_visits,
        COUNT(CASE WHEN v.is_hot_lead = 1 THEN 1 END) as hot_leads
      FROM users u LEFT JOIN visits v ON u.id = v.user_id AND v.visit_date LIKE ?
      WHERE u.role = 'sales_rep' AND u.is_active = 1
      GROUP BY u.id ORDER BY total_pipeline DESC, total_visits DESC
    `, [`${currentMonth}%`]);

    return res.json({
      success: true,
      data: {
        month: currentMonth,
        leaderboard: leaderboard.map((r, idx) => ({
          rank: idx + 1, id: r.id, name: r.name, territory: r.territory,
          avatarText: r.avatar_text, totalVisits: r.total_visits,
          totalPipeline: r.total_pipeline, approvedVisits: r.approved_visits, hotLeads: r.hot_leads,
        })),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/dashboard/notifications ────────────────────────────────────────
router.get('/notifications', (req, res) => {
  try {
    const db = getDb();
    const notifications = db.all(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    db.run('UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0', [req.user.id]);
    return res.json({ success: true, data: notifications });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
