// Import Express framework
const express = require('express');

// Create a router object to define routes
const router = express.Router();

// Import database connection
const db = require('./database');

// Import bcrypt for password hashing (security)
const bcrypt = require("bcrypt");

// GET all students
router.get('/', (req, res) => {
  // Run SQL query to get all students
  db.all("SELECT * FROM students", (err, rows) => {

    // If error occurs, send server error response
    if (err) return res.status(500).json({ error: err.message });

    // Send all student records as JSON
    res.json(rows);
  });
});

// POST add student
router.post('/', (req, res) => {

// Extract student data from request body (frontend form)
const { name, course, year, email, gender, studentId, phone } = req.body;

// Insert new student into database
db.run(
   "INSERT INTO students (name, course, year, email, gender, studentId, phone) VALUES (?, ?, ?, ?, ?, ?, ?)",

    // Values to insert into the database
    [name, course, year, email, gender, studentId, phone],

    function (err) {

      // If error occurs, return error message
      if (err) return res.status(500).json({ error: err.message });

      // Send success response with the new student's ID
      res.json({ message: "Student added", id: this.lastID });
    }
  );
});

// UPDATE student (optional but good)

// This is another DELETE route (duplicate)
// It also deletes a student but includes console logs for debugging
router.delete('/:id', (req, res) => {

  // Log the ID being deleted (for debugging)
  console.log("DELETE request ID:", req.params.id);

  db.run(
    "DELETE FROM students WHERE id = ?",
    [req.params.id],
    function (err) {

      // Log error if it happens
      if (err) {
        console.log("Error:", err);
        return res.status(500).json({ error: err.message });
      }

      // Log how many rows were deleted
      console.log("Rows deleted:", this.changes);

      // If no rows deleted, student does not exist
      if (this.changes === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Success message
      res.json({ message: "Student deleted" });
    }
  );
});

// PUT update student
router.put('/:id', (req, res) => {

  // Get updated student data from request body
  const { name, course, year, email, gender, studentId, phone } = req.body;

  // Update student details in database
  db.run(
    `UPDATE students 
     SET name=?, course=?, year=?, email=?, gender=?, studentId=?, phone=? 
     WHERE id=?`,

    // Values to update + ID from URL
    [name, course, year, email, gender, studentId, phone, req.params.id],

    function (err) {

      // Handle error
      if (err) return res.status(500).json({ error: err.message });

      // Success response
      res.json({ message: "Student updated" });
    }
  );
});

// REGISTER user
router.post('/register', async (req, res) => {

  // Get username and password from request body
  const { username, password } = req.body;

  // Hash the password for security (never store plain passwords)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user into database
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    function (err) {
      // Handle error
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      // Success response
      res.json({ message: "User registered" });
    }
  );
});

// LOGIN user
router.post('/login', async (req, res) => {

  // Get login details from request body
  const { username, password } = req.body;

  // Find user in database
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {

      // Handle database error
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // If user not found
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Compare entered password with hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      // If password is incorrect
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Login success
      res.json({ message: "Login successful", user });
    }
  );
});
// Export router so it can be used in server.js
module.exports = router;