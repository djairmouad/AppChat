const express=require("express");
const { search,createUser } = require("../Controllers/user");

const router=express.Router();

router.route("/search").get(search);
router.route("/create").post(createUser)


module.exports=router