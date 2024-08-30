const express=require("express");
const { search } = require("../Controllers/user");

const router=express.Router();

router.route("/search").get(search);


module.exports=router