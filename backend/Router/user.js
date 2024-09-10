const express=require("express");
const { search,createUser,addFriend,fetchUser,fetchFriendUser,fetchConversation,saveConversation  } = require("../Controllers/user");
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
});
router.route("/search").get(search);
router.route("/create").post(createUser)
router.route("/:id").post(addFriend).get(fetchFriendUser)
router.route("/:id/:id_Friend").get(fetchConversation).post(upload.single("file"),saveConversation)
module.exports=router