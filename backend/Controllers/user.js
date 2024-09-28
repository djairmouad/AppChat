
const db=require("../db/db")
const mongodb=require("mongodb")
const ObjectId=mongodb.ObjectId;
const fs=require("fs")
const search=(req,res)=>{
 db.getDb().db().collection("users").find().toArray()
 .then((result) => {
    res.status(200).json({success:true,data:result})
 }).catch((err) => {
    console.log(err)
    res.status(400).json({success:true,message:err})
 });
}


const addFriend=(req,res)=>{
  let {id}=req.params;
  let {id_Friend}=req.body;
  id=new ObjectId(id);
  id_Friend= new ObjectId(id_Friend)
  try{
   //add Friend to Users
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
  // check if there is a conversation between users or no 
  db.getDb().db().collection("conversation").findOne({participants:{$all:[id,id_Friend]}})
  .then(result=>{
   if(result===null){
      // Insert conversation
    return  db.getDb().db().collection("conversation").insertOne({
         participants: [
            id,
            id_Friend
          ],
          messages:[]
        })
   }else{
      return null
   }
  }).catch(err=>{
   console.log(err);
  })
}catch(err){
   console.log(err)
}
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

const fetchConversation=(req,res)=>{
   let {id,id_Friend}=req.params;
   id=new ObjectId(id);
   id_Friend=new ObjectId(id_Friend);
   db.getDb().db().collection("conversation").findOne({participants:{$all:[id,id_Friend]}})
   .then(result=>{
      return res.status(200).json({success:true,data:result})
   }).catch(err=>{
      console.log(err)
      return res.status(500).json({success:false,message:err})
   })
}
const saveConversation = (req, res) => {
   let { id, id_Friend } = req.params;
   let { senderId,content,status,timestamp } = req.body;
   let info={ senderId,content,status,timestamp}
   if(req.file){
      if(req.file.filename){
         info={...info,nameFile:req.file.filename}
      }
   }
   id = new ObjectId(id);
   id_Friend = new ObjectId(id_Friend);
   db.getDb().db().collection("conversation").updateOne(
       { participants: { $all: [id, id_Friend] } }, // Match condition
       { $push: { messages: {...info} } } // Update with $push
   )
   .then(result => {
       return res.status(200).json({ success: true, data: result });
   })
   .catch(err => {
       console.log(err);
       return res.status(500).json({ success: false, message: err });
   });
};

const updateProfile = (req, res) => {
   const { name, email } = req.body
   let { id } = req.params;
   try {
      id = new ObjectId(id);  // Convert the ID to ObjectId
   } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
   }
   
   let nameFile = "";

   let updateData = { 
      name: name, 
      email: email 
   };

   if (req.file && req.file.filename) {
      nameFile = req.file.filename;
      updateData={...updateData,profileImage: nameFile}
   }
   
   db.getDb().db().collection("users").updateOne(
      { _id: id },
      { $set: updateData }
   )
   .then(result => {
      return res.status(200).json({ success: true, data: result });
   })
   .catch(err => {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
   });
};
module.exports={search,addFriend,fetchUser,fetchFriendUser,fetchConversation,
   saveConversation,updateProfile
}