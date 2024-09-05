
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
  let {id}=req.params;
  let {id_Friend}=req.body;
  id=new ObjectId(id);
  id_Friend= new ObjectId(id_Friend)
  db.getDb().db().collection("users").updateOne({_id: id},{$addToSet:{Friends:id_Friend}})
  .then(result=>{
   db.getDb().db().collection("users").updateOne({_id:id_Friend},{$addToSet:{Friends:id}})
   .then(result=>{
      res.status(200).json({success:true,message:"friend had been add"});
   }).catch(err=>{
    console.log(err);
    res.status(200).json({success:false,message:err})
   })
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

const fetchFriendUser=(req,res)=>{
const {id}=req.params;
db.getDb().db().collection("users").aggregate([
   { $match: { _id: new ObjectId(id) } },
   {
     $lookup: {
       from: "users",
       localField: "Friends",
       foreignField: "_id",
       as: "FriendUser"
     }
   }
 ]).toArray()
 .then((result) => {
   res.status(200).json({ success: true, data: result });
 })
 .catch(err => {
   console.log(err);
   return res.status(500).json({ success: false, message: err });
 });

}
module.exports={search,createUser,addFriend,fetchUser,fetchFriendUser}