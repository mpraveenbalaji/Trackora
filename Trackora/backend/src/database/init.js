/**
 * Trackora - Database Layer using sql.js (pure JavaScript SQLite)
 * Supports Windows without requiring Visual Studio / native compilation
 * Persists data to disk using a Buffer-based approach
 */
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const DB_PATH = path.resolve(process.env.DB_PATH || './data/trackora.db');

let SQL;
let db;
let saveTimer;

/**
 * Save database to disk (debounced to avoid excessive I/O)
 */
function saveDatabase() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('⚠️ DB save error:', err.message);
  }
}

/**
 * Debounced save - saves after 500ms of inactivity
 */
function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(saveDatabase, 500);
}

/**
 * Execute a statement and return the result (like prepare().run())
 */
function run(sql, params = []) {
  db.run(sql, params);
  scheduleSave();
}

/**
 * Execute a SELECT and return all rows
 */
function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

/**
 * Execute a SELECT and return the first row
 */
function get(sql, params = []) {
  const rows = all(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Execute multiple SQL statements (for schema creation)
 */
function exec(sql) {
  db.run(sql);
  scheduleSave();
}

/**
 * Get the DB wrapper object (similar API to better-sqlite3)
 */
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return { run, all, get, exec };
}

/**
 * Initialize the database
 */
async function initializeDatabase() {
  // Ensure data directory exists
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Load sql.js
  const initSqlJs = require('sql.js');
  SQL = await initSqlJs();

  // Load existing database or create new one
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log(`📂 Database loaded from: ${DB_PATH}`);
  } else {
    db = new SQL.Database();
    console.log(`📂 New database created: ${DB_PATH}`);
  }

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Create schema
  createTables();

  // Seed if empty
  await seedInitialData();

  // Save on process exit
  process.on('exit', saveDatabase);
  process.on('SIGINT', () => { saveDatabase(); process.exit(0); });
  process.on('SIGTERM', () => { saveDatabase(); process.exit(0); });

  return { run, all, get, exec };
}

/**
 * Create all database tables
 */
function createTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL UNIQUE,
      password    TEXT NOT NULL,
      role        TEXT NOT NULL DEFAULT 'sales_rep',
      territory   TEXT,
      phone       TEXT,
      avatar_text TEXT,
      is_active   INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL,
      date            TEXT NOT NULL,
      check_in_time   TEXT,
      check_out_time  TEXT,
      check_in_lat    REAL,
      check_in_lng    REAL,
      check_out_lat   REAL,
      check_out_lng   REAL,
      location_label  TEXT,
      accuracy_meters REAL DEFAULT 3.0,
      status          TEXT DEFAULT 'checked_in',
      created_at      TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE (user_id, date)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      contact_name  TEXT,
      phone         TEXT,
      state         TEXT,
      area          TEXT,
      lat           REAL,
      lng           REAL,
      is_active     INTEGER NOT NULL DEFAULT 1,
      created_by    TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS visits (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL,
      client_id       TEXT,
      client_name     TEXT NOT NULL,
      contact_person  TEXT,
      phone           TEXT,
      state           TEXT,
      area            TEXT,
      lat             REAL,
      lng             REAL,
      deal_amount     REAL DEFAULT 0,
      meeting_type    TEXT DEFAULT 'In-Person',
      notes           TEXT,
      has_photo       INTEGER DEFAULT 0,
      has_audio       INTEGER DEFAULT 0,
      photo_url       TEXT,
      audio_url       TEXT,
      status          TEXT DEFAULT 'pending',
      is_hot_lead     INTEGER DEFAULT 0,
      approved_by     TEXT,
      approved_at     TEXT,
      rejection_note  TEXT,
      visit_date      TEXT,
      visit_time      TEXT,
      created_at      TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS targets (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL,
      month           TEXT NOT NULL,
      visit_target    INTEGER DEFAULT 6,
      revenue_target  REAL DEFAULT 5000000,
      created_at      TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (user_id, month)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL,
      type        TEXT NOT NULL,
      title       TEXT NOT NULL,
      message     TEXT NOT NULL,
      is_read     INTEGER DEFAULT 0,
      ref_id      TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Indexes
  db.run('CREATE INDEX IF NOT EXISTS idx_visits_user_id ON visits(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_visits_status ON visits(status)');
  db.run('CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visit_date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_attendance ON attendance(user_id, date)');
  db.run('CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read)');

  saveDatabase();
  console.log('✅ Database schema created/verified');
}

/**
 * Get current UTC datetime string for SQLite
 */
function nowISO() {
  return new Date().toISOString().replace('T', ' ').split('.')[0];
}

/**
 * Seed initial users and sample data
 */
async function seedInitialData() {
  const userCount = get('SELECT COUNT(*) as count FROM users');
  if (userCount && userCount.count > 0) {
    console.log('📊 Database already seeded, skipping');
    return;
  }

  console.log('🌱 Seeding initial data...');

  const { v4: uuidv4 } = require('uuid');
  const saltRounds = 10;

  // Admin
  const adminId = uuidv4();
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  run('INSERT INTO users (id, name, email, password, role, territory, phone, avatar_text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [adminId, 'Admin User', 'admin@trackora.in', adminPassword, 'admin', 'All India', '+91 98000 00000', 'AU', nowISO(), nowISO()]);

  // Manager
  const managerId = uuidv4();
  const managerPassword = await bcrypt.hash('manager123', saltRounds);
  run('INSERT INTO users (id, name, email, password, role, territory, phone, avatar_text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [managerId, 'Rajesh Kumar', 'rajesh@trackora.in', managerPassword, 'manager', 'South India', '+91 98001 00001', 'RK', nowISO(), nowISO()]);

  // Sales Reps
  const salesPassword = await bcrypt.hash('sales123', saltRounds);

  const praveenId = uuidv4();
  run('INSERT INTO users (id, name, email, password, role, territory, phone, avatar_text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [praveenId, 'Praveen Balaji', 'praveen@trackora.in', salesPassword, 'sales_rep', 'Chennai & Tamil Nadu', '+91 98401 22334', 'PB', nowISO(), nowISO()]);

  const inthiyazId = uuidv4();
  run('INSERT INTO users (id, name, email, password, role, territory, phone, avatar_text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [inthiyazId, 'Inthiyaz Ahmed', 'inthiyaz@trackora.in', salesPassword, 'sales_rep', 'Bengaluru & Karnataka', '+91 97412 88990', 'IA', nowISO(), nowISO()]);

  // Clients
  const clientData = [
    [uuidv4(), 'SMVEC Campus / Tech Park', 'Dean / Admin Office', '+91 413 264 3000', 'Pondicherry', 'Madagadipet, Pondicherry - 605107', 11.942288, 79.815606, praveenId],
    [uuidv4(), 'Pothys Flagship Store', 'Murugan Swaminathan', '+91 98400 11223', 'Tamil Nadu', 'Usman Road, T. Nagar, Chennai - 600017', 13.0418, 80.2341, praveenId],
    [uuidv4(), 'Saravana Stores Elite', 'R. Veeramani', '+91 98401 55667', 'Tamil Nadu', 'Pondy Bazaar, T. Nagar, Chennai - 600017', 13.0402, 80.2389, praveenId],
    [uuidv4(), 'Reliance Retail South HQ', 'Anil Kumble', '+91 99000 44556', 'Karnataka', 'MG Road / Brigade Road, Bengaluru - 560001', 12.9716, 77.5946, inthiyazId],
    [uuidv4(), 'Tata Consultancy Services', 'K. Chandrasekaran', '+91 98402 77889', 'Tamil Nadu', 'Siruseri IT Corridor, OMR, Chennai - 603103', 12.8258, 80.2241, praveenId],
    [uuidv4(), 'L&T Commercial Hub', 'Sachin Tendulkar', '+91 98200 33445', 'Maharashtra', 'Powai Business Hub, Mumbai - 400076', 19.1176, 72.9060, praveenId],
  ];

  for (const c of clientData) {
    run('INSERT INTO clients (id, name, contact_name, phone, state, area, lat, lng, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [...c, nowISO()]);
  }

  // Sample Visits
  const today = new Date().toISOString().split('T')[0];
  const visitData = [
    [uuidv4(), praveenId, 'SMVEC Campus / Tech Park', 'Dean / Admin Office', '+91 413 264 3000',
      'Pondicherry', 'Madagadipet, Pondicherry', 11.942288, 79.815606,
      1850000, 'In-Person', 'Met with administrative board. Discussed Trackora campus and field deployment.',
      1, 1, 'approved', 1, managerId, nowISO(), today, '10:15'],
    [uuidv4(), praveenId, 'Pothys Flagship Store', 'Murugan Swaminathan (GM)', '+91 98400 11223',
      'Tamil Nadu', 'Usman Road, T. Nagar, Chennai', 13.0418, 80.2341,
      1500000, 'In-Person', 'Enterprise contract discussion for retail tracking solution.',
      1, 1, 'approved', 1, managerId, nowISO(), today, '11:45'],
    [uuidv4(), praveenId, 'Saravana Stores Elite', 'R. Veeramani (Procurement)', '+91 98401 55667',
      'Tamil Nadu', 'Pondy Bazaar, Chennai', 13.0402, 80.2389,
      850000, 'Product Demo', 'Gave full product demonstration to procurement head.',
      1, 0, 'approved', 1, managerId, nowISO(), today, '13:20'],
    [uuidv4(), inthiyazId, 'Reliance Retail South Hub', 'Anil Kumble (Regional Head)', '+91 99000 44556',
      'Karnataka', 'MG Road, Bengaluru', 12.9716, 77.5946,
      4500000, 'Contract Negotiation', 'High-value enterprise contract negotiation for pan-India rollout.',
      1, 1, 'pending', 1, null, null, today, '15:15'],
  ];

  for (const v of visitData) {
    run(`INSERT INTO visits (id, user_id, client_name, contact_person, phone, state, area, lat, lng,
        deal_amount, meeting_type, notes, has_photo, has_audio, status, is_hot_lead, approved_by, approved_at, visit_date, visit_time, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [...v, nowISO(), nowISO()]);
  }

  // Attendance
  run('INSERT INTO attendance (id, user_id, date, check_in_time, check_in_lat, check_in_lng, location_label, accuracy_meters, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [uuidv4(), praveenId, today, nowISO(), 11.942288, 79.815606, 'Pondicherry / Chennai • Verified (±3m)', 3.0, 'checked_in', nowISO(), nowISO()]);

  run('INSERT INTO attendance (id, user_id, date, check_in_time, check_in_lat, check_in_lng, location_label, accuracy_meters, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [uuidv4(), inthiyazId, today, nowISO(), 12.9716, 77.5946, 'Bengaluru • Verified (±3m)', 3.0, 'checked_in', nowISO(), nowISO()]);

  // Targets
  const currentMonth = today.slice(0, 7);
  run('INSERT INTO targets (id, user_id, month, visit_target, revenue_target, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [uuidv4(), praveenId, currentMonth, 6, 5000000, nowISO()]);
  run('INSERT INTO targets (id, user_id, month, visit_target, revenue_target, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [uuidv4(), inthiyazId, currentMonth, 6, 5000000, nowISO()]);

  saveDatabase();
  console.log('✅ Initial data seeded successfully');
  console.log('   Users: admin@trackora.in (admin123), praveen@trackora.in (sales123), inthiyaz@trackora.in (sales123), rajesh@trackora.in (manager123)');
}

module.exports = { initializeDatabase, getDb, saveDatabase };
