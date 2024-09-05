const express=require("express");
const { search,createUser,addFriend,fetchUser,fetchFriendUser } = require("../Controllers/user");

const router=express.Router();

router.route("/search").get(search);
router.route("/create").post(createUser)
router.route("/:id").post(addFriend).get(fetchFriendUser)

module.exports=router