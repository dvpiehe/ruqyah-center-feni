const path = require('path');
const fs = require('fs');

// Check for locally compiled native addon (Hostinger / Linux GLIBC compatibility)
const releaseBinding = path.join(__dirname, '..', 'node_modules', 'better-sqlite3', 'build', 'Release', 'better_sqlite3.node');
const prebuildsDir = path.join(__dirname, '..', 'node_modules', 'better-sqlite3', 'prebuilds');

// On environments with older glibc (like Hostinger GLIBC 2.28), the prebuild linux-x64.node fails.
// If prebuilds exist alongside a compiled release, remove prebuilds so it never attempts to load it.
try {
  if (fs.existsSync(releaseBinding) && fs.existsSync(prebuildsDir)) {
    fs.rmSync(prebuildsDir, { recursive: true, force: true });
  }
} catch (e) {
  // Ignore permission or file-locking warnings
}

const dbOptions = {};
if (fs.existsSync(releaseBinding)) {
  dbOptions.nativeBinding = releaseBinding;
}

const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'ruqyah.db');
const schemaPath = path.join(__dirname, 'schema.sql');

const db = new Database(dbPath, dbOptions);

// Enable WAL mode and foreign keys for high concurrency & data integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDb() {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
}

initDb();

module.exports = db;

