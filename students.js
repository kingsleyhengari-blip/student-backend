const express = require('express');//Import Express framework
const router = express.Router();//Create router
const db = require('./database');//Import database
const bcrypt = require("bcrypt");//Import bcrypt for password hashing

//GET all students
router.get('/',(req, res)=>{
  try{
    //Run SQL query to get all students
    const rows = db.prepare("SELECT * FROM students").all();

    //Send all student records as JSON
    res.json(rows);
  }catch(err){
    //If error occurs, send server error response
    res.status(500).json({error: err.message });
  }
});
//POST add student
router.post('/',(req,res)=>{
  //Extract student data from request body
  const{name, course, year, email, gender, studentId, phone} = req.body;
  try {
    //Insert new student into database
    const result = db.prepare(`
      INSERT INTO students (name,course, year, email,gender, studentId, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, course, year, email, gender, studentId, phone);
    //Send success response with new student ID
    res.json({message: "Student added", id: result.lastInsertRowid});
  }catch(err){
    //If error occurs, return error message
    res.status(500).json({ error: err.message});
  }
});
//DELETE student
router.delete('/:id',(req,res)=>{
  // Log ID for debugging
  console.log("DELETE request ID:", req.params.id);
    try{
    // Delete student from database
    const result = db.prepare("DELETE FROM students WHERE id = ?")
      .run(req.params.id);

    //If no rows deleted, student does not exist
    if(result.changes === 0){
      return res.status(404).json({ message: "Student not found" });
    }
    //Success message
    res.json({message: "Student deleted"});
  }catch (err){
    //Handle error
    console.log("Error:", err);
    res.status(500).json({ error: err.message });
  }
});
//PUT update student
router.put('/:id',(req, res)=>{
  //Get updated student data
  const{name, course, year, email, gender, studentId, phone} = req.body;

  try{
    //Update student details in database
    db.prepare(`
      UPDATE students 
      SET name=?, course=?, year=?, email=?, gender=?, studentId=?, phone=? 
      WHERE id=?
    `).run(name, course, year, email, gender, studentId, phone, req.params.id);
    //Success response
    res.json({message: "Student updated"});
  } catch (err) {
    //Handle error
    res.status(500).json({error: err.message});
  }
});
//REGISTER user
router.post('/register', async(req,res)=>{
  //Get username and password
  const{username,password} = req.body;

  try{
    //Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    //Insert new user into database
    db.prepare("INSERT INTO users (username, password) VALUES (?, ?)")
      .run(username, hashedPassword);
    //Success response
    res.json({ message: "User registered" });
  }catch(err){
    //Handle error
    res.status(500).json({ error: err.message });
  }
});
//LOGIN user
router.post('/login', async (req, res) => {
  //Get login details
  const{username, password} = req.body;

  try{
    //Find user in database
    const user = db.prepare("SELECT * FROM users WHERE username = ?")
      .get(username);

    //If user not found
    if(!user){
      return res.status(401).json({message: "Invalid credentials" });
    }
    //Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    //If password incorrect
    if (!isMatch) {
      return res.status(401).json({message: "Invalid credentials" });
    }
    //Login success
    res.json({message: "Login successful", user });
  } catch (err) {
    //Handle error
    res.status(500).json({error: err.message });
  }
});
//Export router
module.exports = router;