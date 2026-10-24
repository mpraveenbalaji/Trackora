/**
 * Trackora - Authentication Routes (sql.js compatible)
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { getDb } = require('../database/init');
const { generateToken, authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const db = getDb();
      const user = db.get('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      const token = generateToken(user.id);

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          territory: user.territory,
          phone: user.phone,
          avatarText: user.avatar_text,
          isActive: user.is_active === 1,
          createdAt: user.created_at,
        },
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      territory: req.user.territory,
      phone: req.user.phone,
      avatarText: req.user.avatar_text,
      isActive: req.user.is_active === 1,
    },
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
router.post('/logout', authenticateToken, (req, res) => {
  return res.json({ success: true, message: 'Logged out. Please discard your token.' });
});

// ─── POST /api/auth/change-password ──────────────────────────────────────────
router.post(
  '/change-password',
  authenticateToken,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      const db = getDb();
      const user = db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      db.run('UPDATE users SET password = ?, updated_at = ? WHERE id = ?',
        [hashed, new Date().toISOString(), req.user.id]);

      return res.json({ success: true, message: 'Password changed successfully.' });
    } catch (err) {
      console.error('Change password error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

module.exports = router;
