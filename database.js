const sqlite3 = require('sqlite3').verbose();

// create or open database file
const database = new sqlite3.Database('./students.db');

// create tables
database.serialize(() => {

  // STUDENTS TABLE (updated)
  database.run(`
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
  `);

  // USERS TABLE (for login)
  database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT
    )
  `);

});

module.exports = database;