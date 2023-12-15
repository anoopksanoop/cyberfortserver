
const express=require('express')
const router=express.Router()
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { createPool } = require('mysql');
 

const pool= createPool({
    host :"localhost",
    user:"root",
    password:"password",
    database:"chat", 
    connectionLimit:10, 
  })

  

router.get('/userdata',async(req,res)=>{
    const LoginData = [
       {
         id:1,
         name: "Akhil k",
         email:"Akhil@gmail.com",
         password: "Akhil123",
         image:"https://propermusic.com/cdn/shop/products/5013929087705.jpg?v=1677119464&width=1024",
     
         decs:"Back-End Developer",
         posts:"100",
           followers:"11K",
           followings:"566"
       },
       {
         id:2,
         name: "Amaljith",
         email:"Amal@gmail.com",
         password: "Amal123",
         image:"https://i.scdn.co/image/ab67616d0000b27328ac4e0ef0f0decb1d3bc4b1",
     
         decs:"Software Devloper",
         posts:"256",
         followers:"5.2k",
         followings:"55"
       },
       {
         id:3,
         name: "Rahul k",
         email:"Rahul@gmail.com",
         password: "Rahul123",
         image:"https://static.toiimg.com/thumb/msid-101181308,width-1280,resizemode-4/101181308.jpg",
     
         decs:"Software Engineer",
         posts:"423",
         followers:"6.4k",
         followings:"206"
       },
       {
         id:4,
         name: "Arjun Das",
         email:"Arjun@gmail.com",
         password: "Arjun123",
         image:"https://static.toiimg.com/thumb/msid-88092020,width-1280,resizemode-4/88092020.jpg",
         
         decs:"Front-End Developer",
         posts:"1",
         followers:"10K",
         followings:"4034"
       },
     ];
     
    for (const user of LoginData) {
       const { id, name, email, password,image , decs, posts, followers, followings} = user;
   
       const insertQuery = `INSERT INTO user_list (id, name, email, password, decs, posts, followers, followings, image) VALUES
       (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
   
       pool.query(insertQuery, [id, name, email, password, decs, posts, followers, followings, image], (error, result) => {
         if (error) {
           console.error('Error storing user in the database:', error);
         } else {
          //  console.log('User stored in the database:', result);
         }
       });
     }
     res.status(201).json(LoginData);
    //  console.log(LoginData)
   });
 
   router.get('/getuserdata', (req, res) => {
    const selectQuery = 'SELECT * FROM user_list';
  
    pool.query(selectQuery, (error, result) => {
      if (error) {
        console.error('Error retrieving user data from the database:', error);
         res.status(500).json({ error: 'Internal Server Error' });
      } else {
        //  console.log('User data retrieved from the database:', result);
         res.status(200).json(result);
      }
    });
  });



module.exports=router 