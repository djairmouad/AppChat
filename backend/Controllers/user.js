
const db=require("../db/db")
const mongodb=require("mongodb")
const ObjectId=mongodb.ObjectId;
const search=(req,res)=>{
 db.getDb().db().collection("users").find().toArray()
 .then((result) => {
    res.status(200).json({success:true,data:result})
 }).catch((err) => {
    console.log(err)
    res.status(400).json({success:true,message:err})
 });
}

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

const addFriend=(req,res)=>{
  const {id}=req.params;
  const {id_Friend}=req.body;
  db.getDb().db().collection("users").updateOne({_id: new ObjectId(id)},{$push:{Friends:new ObjectId(id_Friend)}})
  .then(result=>{
   res.status(200).json({success:true,message:"friend had been add"})
  }).catch(err=>{
   console.log(err);
   res.status(200).json({success:false,message:err})
  })
}

const fetchUser=(req,res)=>{
   const {id}=req.params;
   db.getDb().db().collection("users").findOne({_id:new ObjectId(id)})
   .then((result)=>{
      res.status(200).json({success:true,data:result})
   })
   .catch(err=>{
      console.log(err)
      res.status(500).json({success:false,message:err})
   })
}
module.exports={search,createUser,addFriend,fetchUser}