const express=require("express");
const jwt=require("jsonwebtoken")
const router=express.Router();
const db=require("../db/db")
const privateKey="HelloWorld"
router.post("/",(req,res)=>{
    const {email,password}=req.body;
    db.getDb().db().collection("users").findOne({email:email,password:password}).then(data => {
        const user = { id: data._id, email: data.email };
        // Generate a JWT token with the user data and private key
        const token = jwt.sign(user, privateKey, { expiresIn: "1h" });
        
        res.status(200).json({success:true,token:token,user})
      })
      .catch(err => {
        console.log(err);
      });
})

module.exports=router;