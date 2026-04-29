// Load environment variables from .env file
require("dotenv").config();

// Import students routes file
const studentsRouter = require('./students');

// Import required packages
const express = require("express");
const cors = require("cors");

// Create Express app
const app = express();

// Enable CORS so frontend can communicate with backend
app.use(cors());

// Allow server to accept JSON data from requests (e.g., forms)
app.use(express.json());

// Connect students routes to '/students' endpoint
// Example: /students, /students/:id
app.use('/students', studentsRouter);

// Test route to check if backend is running
app.get("/",(req, res)=>{
  res.send("Backend working");
});
// Set port from environment variable or default to 5000
const PORT = process.env.PORT||5000;

// Start server and listen on the specified port
app.listen(PORT,()=>{
  console.log("Server running on port"+ PORT);
});