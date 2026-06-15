const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  resendOtp,
  resetPassword,
  registerUser,
  login,
  refreshAccessToken,
} = require("../controllers/AuthController");

const loginLimiter = require("../middleware/loginLimiter");

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/resend-otp", resendOtp);

router.post("/register", registerUser);

router.post("/login", loginLimiter, login);

router.post("/reset-password", resetPassword);

router.post("/refresh-token", refreshAccessToken);

module.exports = router;
