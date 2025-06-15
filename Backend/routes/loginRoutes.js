const router = require("express").Router();
const loginController = require("../Controller/loginController");

// Step 1: User submits username + password → OTP is sent
router.post("/userLogin", loginController.loginUser);

// Step 2: User submits username + OTP → Get the JWT token
router.post("/verify-otp", loginController.verifyOtp);

module.exports = router;

//set NODE_TLS_REJECT_UNAUTHORIZED=0
// npm start