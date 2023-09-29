// getting the express first to work 
const express = require("express");
const router = express.Router();

const userController =require("../controllers/userController");



router.post("/signin",userController.getAllUsers);
router.post("/signup",userController.createUser);
router.put("auth/resetpassword/:email",userController.resetPassword);





module.exports=router;