const express=require("express");
const { search,addFriend,fetchUser,fetchFriendUser,fetchConversation,saveConversation,
  updateProfile
  } = require("../Controllers/user");
const multer=require("multer")
const path=require("path")
const router=express.Router();
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "upload");
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
//     }
// });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/upload/")
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname)
    },
  })

const upload = multer({
    storage: storage,
})

router.route("/search").get(search);
router.route("/:id").post(addFriend).get(fetchFriendUser)
router.route("/profile/:id").post(upload.single("profile"),updateProfile)
router.route("/:id/:id_Friend").get(fetchConversation).post(upload.single("fileUpload") ,saveConversation)
module.exports=router