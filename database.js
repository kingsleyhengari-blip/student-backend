const Database = require('better-sqlite3');
const database = new Database('students.db');

// CREATE TABLES (no serialize needed)
database.prepare(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    course TEXT,
    year TEXT,
    email TEXT,
    gender TEXT,
    studentId TEXT,
    phone TEXT
  )
`).run();

database.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )
`).run();

module.exports = database;