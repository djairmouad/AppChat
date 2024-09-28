const db=require("../db/db")
const mongodb=require("mongodb")
const createUser=(req,res)=>{
    const {name,email,password}=req.body;
    db.getDb().db().collection("users").insertOne({name:name,email:email,password:password})
    .then((result)=>{
       return res.status(200).json({success:true,message:"the user has been Create Compte"})
    }).catch((err)=>{
       console.log(err)
       return res.status(500).json({success:false,message:err})
    })
 }


 module.exports={createUser}