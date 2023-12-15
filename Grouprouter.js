
const multer=require("multer")
const path = require('path');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { createPool } = require('mysql');


const storage =multer.diskStorage({
   destination:(req,file,cb)=>{
    cb(null,"public/images")
   }, 
   filename:(req,file,cb)=>{
    cb(null, `${Date.now()}_${file.originalname}`);
   }
})
const upload=multer({
    storage:storage
})

const pool= createPool({
    host :"localhost",
    user:"root",
    password:"password",
    database:"chat", 
    connectionLimit:10, 
  })



router.post("/signup", (req, res) => {
  const { name, email,decs, password, confirmPassword } = req.body;
    console.log('Password', password);
    console.log('Email', email)
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Insert data into MySQL database
  const insertQuery = `INSERT INTO user_list ( name, email, decs, password) VALUES ( ?, ?, ?, ?)`;

  console.log("Form Data")
  console.log(JSON.stringify(req.body))
  console.log("End Form Data")
  
  if(email && password){
    pool.query(insertQuery, [ name, email, decs, password], (err, results) => {
        if (err) {
          console.error('Error inserting data into MySQL:', err);
          return res.status(500).json({ message: "Internal server error" });
        }
        console.log(JSON.stringify(results))
        res.json({ message: "Signup successful", results });
      });
  }else{
    return res.status(500).json({error: 'Please fill email and password fields'});``
  }

});




router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password" });
  }

  const selectQuery = `SELECT * FROM user_list WHERE email = ? AND password = ?`;

  pool.query(selectQuery, [email, password], (err, results) => {
    if (err) {
      console.error('Error querying data from MySQL:', err);
      return res.status(500).json({ message: "Internal server error" });
    }
    console.log(results)
    console.log('WHERE email AND password')
    if (results.length > 0) {
      const user = results[0];
      res.json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  });
});






router.post ("/profile",upload.single('image'),(req,res)=>{
    //  const {userId,image}=req.body
//    const image=req.file.filename;
console.log(req.body)
console.log(req.file)
const userId = req.body.userId; 
const image = req.file.filename;
const imagePath = req.file.path.replace('public','');
console.log("*****************")

console.log(JSON.stringify(image))
console.log("User Id", userId)
console.log(req.file.path)
const updateQuery = `UPDATE user_list SET image = ? WHERE id = ?`;

pool.query(updateQuery, [imagePath, userId], (err, results) => {
  if (err) {
    console.error('Error updating data in MySQL:', err);
    return res.status(500).json({ message: "Internal server error" });
  }
  console.log("After save success")
  console.log(JSON.stringify(results));

  res.json({ message: "Profile updated successfully", results });
});
});
module.exports = router;
