const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'ruqyah.db');
const schemaPath = path.join(__dirname, 'schema.sql');

const db = new Database(dbPath);

// Enable WAL mode and foreign keys for high concurrency & data integrity
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDb() {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
}

initDb();

module.exports = db;
