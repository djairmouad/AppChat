const express=require("express");
const { search,createUser,addFriend,fetchUser,fetchFriendUser,fetchConversation } = require("../Controllers/user");

const router=express.Router();

router.route("/search").get(search);
router.route("/create").post(createUser)
router.route("/:id").post(addFriend).get(fetchFriendUser)
router.route("/:id/:id_Friend").get(fetchConversation)
module.exports=router