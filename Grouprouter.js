const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { createPool } = require("mysql");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.normalize("public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, `file-${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
});

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "chat",
  connectionLimit: 10,
});

router.post("/signup", (req, res) => {
  const { name, email, decs, password, confirmPassword } = req.body;
  console.log("Password", password);
  console.log("Email", email);
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Insert data into MySQL database
  const insertQuery = `INSERT INTO user_list ( name, email, decs, password) VALUES ( ?, ?, ?, ?)`;

  console.log("Form Data");
  console.log(JSON.stringify(req.body));
  console.log("End Form Data");

  if (email && password) {
    pool.query(insertQuery, [name, email, decs, password], (err, results) => {
      if (err) {
        console.error("Error inserting data into MySQL:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      console.log(JSON.stringify(results));
      res.json({ message: "Signup successful", results });
    });
  } else {
    return res
      .status(500)
      .json({ error: "Please fill email and password fields" });
    ``;
  }
});

router.post("/login", (req, res) => {
  console.log("Login")
  console.log(req.url)
  var url = req.protocol + '://' + req.get('host');
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password" });
  }

  const selectQuery = `SELECT * FROM user_list WHERE email = ? AND password = ?`;

  pool.query(selectQuery, [email, password], (err, results) => {
    if (err) {
      console.error("Error querying data from MySQL:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    console.log(results);
    console.log("WHERE email AND password");
    if (results.length > 0) {
      const user = results[0];
      user.image = `${url}${user.image}`
      res.json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  });
});



// router.post("/profile", upload.single("image"), (req, res) => {
//   console.log(req.body);
//   console.log(req.file);
//   const userId = req.body.userId;
//   const image = req.file.filename;
//   const imagePath = req.file.path.replace("public", "");

//   console.log(JSON.stringify(image));
//   console.log("User Id", userId);
//   console.log(req.file.path);
//   const updateQuery = `UPDATE user_list SET image = ? WHERE id = ?`;

//   pool.query(updateQuery, [imagePath, userId], (err, results) => {
//     if (err) {
//       console.error("Error updating data in MySQL:", err);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//     console.log("After save success");
//     console.log(JSON.stringify(results));

//     res.json({ message: "Profile updated successfully", results });
//   });
// });


// router.get("/profile/:userId", (req, res) => {
//   const userId = req.params.userId;
//   const selectQuery = `SELECT * FROM user_list WHERE id = ?`;

//   pool.query(selectQuery, [userId], (err, results) => {
//     if (err) {
//       console.error("Error querying data from MySQL:", err);
//       return res.status(500).json({ message: "Internal server error" });
//     }

//     if (results.length > 0) {
//       const user = results[0];

//       // Include the full URL for the user's image in the response
//       user.image = `http://localhost:3001/${user.image}`;

//       res.json({ message: "Profile information fetched successfully", user });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   });
// });


router.post("/profile", upload.single("image"), (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  console.log(req.body);
  console.log(req.file);
  const userId = req.body.userId;
  const image = req.file.filename;
  const imagePath = req.file.path.replace("public", "");

  console.log(JSON.stringify(image));
  console.log("User Id", userId);
  console.log(req.file.path);
  const updateQuery = `UPDATE user_list SET image = ? WHERE id = ?`;

  pool.query(updateQuery, [imagePath, userId], (err, results) => {
    if (err) {
      console.error("Error updating data in MySQL:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    console.log("After save success");
    console.log(JSON.stringify(results));

    // Fetch the updated user information after the image update
    const selectQuery = `SELECT * FROM user_list WHERE id = ?`;

    pool.query(selectQuery, [userId], (selectErr, selectResults) => {
      if (selectErr) {
        console.error("Error querying data from MySQL:", selectErr);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (selectResults.length > 0) {
        const user = selectResults[0];

        // Include the full URL for the user's image in the response
        user.image = `${url}${user.image}`;

        res.json({ message: "Profile updated successfully", user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    });
  });
});



router.post("/posts", upload.single("image"), (req, res) => {
  console.log(req.body);
  console.log(req.file);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const userId = req.body.userId;
  const { imgdecs } = req.body;
  const postimage = req.file.filename;
  const imagePath = req.file.path.replace("public", "").replace(/\\/g, "/");
  console.log("((((((((((((((");
  console.log(imagePath);
  console.log(")))))))))))))))))))");
  // Insert data into MySQL database
  const insertQuerys = `INSERT INTO posts ( userId ,image ,imgdecs) VALUES ( ?, ?, ?)`;
  console.log(JSON.stringify(req.body));
  console.log(JSON.stringify(postimage));
  pool.query(insertQuerys, [userId, imagePath, imgdecs], (err, results) => {
    if (err) {
      console.error("Error inserting data into MySQL:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    console.log("After save success");
    console.log(JSON.stringify(results));

    res.json({ message: "Signup successful", results });
  });
});

router.get("/posts/:id?", (req, res) => {
  console.log("GET post")
  const url = req.protocol + '://' + req.get('host');
  
  console.log(url)
  console.log("#################")
  let selectAllPostsQuery = `SELECT * FROM posts`;
  if(req.params.id){
    selectAllPostsQuery = `${selectAllPostsQuery} WHERE userId=${req.params.id}`;
  }

  pool.query(selectAllPostsQuery, (err, results) => {
    if (err) {
      console.error("Error querying data from MySQL:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    results = results.map((post) => {
      post.image = `${url}${post.image}`
      return post;
    })

    res.json({ posts: results });
  });
});

router.get('/post/:id', (req, res) => {
  const id = req.params.id;
  const url = req.protocol + '://' + req.get('host');
  const selectQuery = `SELECT * FROM posts WHERE id = ?`;
  pool.query(selectQuery, [id], (selectErr, selectResults) => {
    if (selectErr) {
      console.error("Error querying data from MySQL:", selectErr);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (selectResults.length > 0) {
      const post = selectResults[0];

      // Include the full URL for the user's image in the response
      post.image = `${url}${post.image}`;

      res.json({ message: "Post list successfully", post });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  });
});

router.delete("/posts/:postId", (req, res) => {
  const postId = req.params.postId;

  // Fetch image path from the database using postId
  const selectImagePathQuery = `SELECT image FROM posts WHERE id = ?`;

  pool.query(selectImagePathQuery, [postId], (err, results) => {
    if (err) {
      console.error("Error querying data from MySQL:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    const imagePath = results[0]?.image || "";

    // Delete the post from the database
    const deletePostQuery = `DELETE FROM posts WHERE id = ?`;

    pool.query(deletePostQuery, [postId], (err, results) => {
      if (err) {
        console.error("Error deleting data from MySQL:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      // Delete the image file from the server
      if (imagePath) {
        const fs = require("fs");
        const imagePathOnServer = `public${imagePath}`;

        fs.unlink(imagePathOnServer, (err) => {
          if (err) {
            console.error("Error deleting image file:", err);
          }
        });
      }

      res.json({ message: "Post deleted successfully", results });
    });
  });
});

module.exports = router;
