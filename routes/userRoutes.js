const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { userVerification } = require("../middlewares/authMiddleware");





router.get("/protected-route", userVerification, (req, res) => {
    // Access the authenticated user using req.user
    const authenticatedUser = req.user;
    return res.json({ status: true, user: authenticatedUser.first_name });
  });

//verifying the token in the frontend homepage

router.post('/signin', userController.getAllUsers);
router.post('/signup',  userController.createUser);
router.post('/resetpassword/:email',userController.resetPassword);
// Creating a separate router for forgotten passwords
router.post('/resetpassword/otp/:email', userController.forgottenPassword);
router.post('/resetpassword/otpgenerate/:email', userController.emailOtpCodes);

module.exports = router; // Export the router as a function
