require("dotenv").config();//Load environment variables from .env file
const studentsRouter = require('./students');//Import students routes file
//Import required packages
const express = require("express");
const cors = require("cors");
const app = express();//Create Express app

app.use(cors());//Enable CORS so frontend can communicate with backend

app.use(express.json());//Allow server to accept JSON data from requests (e.g., forms)

app.use('/students', studentsRouter);//Connect students routes to '/students' endpoint

//Test route to check if backend is running
app.get("/",(req, res)=>{
  res.send("Backend working");
});
//Set port from environment variable or default to 5000
const PORT = process.env.PORT||5000;

//Start server and listen on the specified port
app.listen(PORT,()=>{
  console.log("Server running on port"+ PORT);
});