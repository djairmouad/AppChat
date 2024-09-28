const express=require("express");
const jwt=require("jsonwebtoken")
const router=express.Router();
const db=require("../db/db")
const privateKey="HelloWorld"
router.post("/", (req, res) => {
  const { email, password } = req.body;
  
  db.getDb().db().collection("users").findOne({ email: email, password: password })
    .then(data => {
      if (!data) {
        // If no user is found, return a 401 Unauthorized response
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
      
      // Proceed if user is found
      const user = { id: data._id, email: data.email };
      // Generate a JWT token with the user data and private key
      const token = jwt.sign(user, privateKey, { expiresIn: "1h" });
      
      // Send the token and user data
      res.status(200).json({ success: true, token: token, user });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ success: false, message: "Internal server error" });
    });
});


module.exports=router;