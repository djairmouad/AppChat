const express=require("express");
const { createUser } = require("../Controllers/createUser");

const router=express.Router();

router.post("/create",createUser)


module.exports=router