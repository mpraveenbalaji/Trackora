const { initializeDatabase, saveDatabase } = require('../src/database/init');

async function cleanup() {
  const { run, get, all } = await initializeDatabase();
  const admin = get("SELECT id FROM users WHERE email = 'admin@trackora.in'");
  if (admin && admin.id) {
    run("UPDATE visits SET approved_by = ? WHERE approved_by NOT IN (SELECT id FROM users)", [admin.id]);
  }
  run("DELETE FROM users WHERE email = 'rajesh@trackora.in'");
  saveDatabase();
  const users = all("SELECT name, email, role, territory FROM users");
  console.log("Current active users in DB:", users);
}

cleanup().catch(console.error);
