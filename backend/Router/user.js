const express=require("express");
const { search,createUser,addFriend,fetchUser } = require("../Controllers/user");

const router=express.Router();

router.route("/search").get(search);
router.route("/create").post(createUser)
router.route("/:id").post(addFriend).get(fetchUser)

module.exports=router