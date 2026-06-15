const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserModel = require("../models/User");
const OtpModel = require("../models/Otp");

const { AccessToken, RefreshToken } = require("../utils/token");
const transporter = require("../config/mailer");

// ===================== SEND OTP =====================

async function sendOtp(req, res) {
  const { email, purpose } = req.body;

  try {
    if (!email || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Email and purpose are required",
      });
    }

    const user = await UserModel.findOne({ email });

    if (purpose === "register" && user) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    if (purpose === "forgot-password" && !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpModel.findOneAndUpdate(
      { email, purpose },
      {
        email,
        otp,
        purpose,
        isVerified: false,
        createdAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      },
    );

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject:
        purpose === "register"
          ? "LMS Email Verification"
          : "LMS Password Reset",

      html: `
        <div style="font-family:sans-serif">
          <h2>LMS OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>OTP valid for 10 minutes</p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
}

// ===================== VERIFY OTP =====================

async function verifyOtp(req, res) {
  const { email, otp, purpose } = req.body;

  try {
    const record = await OtpModel.findOne({
      email,
      purpose,
    });

    if (!record || record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const diff = Date.now() - new Date(record.createdAt).getTime();

    if (diff > 10 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    record.isVerified = true;

    await record.save();

    return res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
}

// ===================== RESEND OTP =====================

async function resendOtp(req, res) {
  const { email, purpose } = req.body;

  try {
    const record = await OtpModel.findOne({
      email,
      purpose,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Please request OTP first",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    record.otp = otp;
    record.isVerified = false;
    record.createdAt = new Date();

    await record.save();

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "LMS OTP Verification",

      html: `
        <div style="font-family:sans-serif">
          <h2>LMS OTP Verification</h2>
          <p>Your new OTP is:</p>
          <h1>${otp}</h1>
          <p>OTP valid for 10 minutes</p>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
    });
  }
}

// ===================== REGISTER STUDENT =====================

async function registerUser(req, res) {
  const { name, email, password, mobile } = req.body;

  try {
    const otpRecord = await OtpModel.findOne({
      email,
      purpose: "register",
    });

    if (!otpRecord || !otpRecord.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify email first",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "student",
    });

    await OtpModel.deleteOne({
      email,
      purpose: "register",
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
}

// ===================== LOGIN =====================

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.status) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.json({
      success: true,
      accessToken: AccessToken(user),
      refreshToken: RefreshToken(user),
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
}

// ===================== RESET PASSWORD =====================

async function resetPassword(req, res) {
  const { email, password } = req.body;

  try {
    const otpRecord = await OtpModel.findOne({
      email,
      purpose: "forgot-password",
    });

    if (!otpRecord || !otpRecord.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify OTP first",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    await OtpModel.deleteOne({
      email,
      purpose: "forgot-password",
    });

    return res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
}

// ===================== REFRESH TOKEN =====================

async function refreshAccessToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token required",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const accessToken = AccessToken(user);

    return res.json({
      success: true,
      accessToken,
    });
  } catch {
    return res.status(403).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
}

module.exports = {
  sendOtp,
  verifyOtp,
  resendOtp,
  registerUser,
  login,
  resetPassword,
  refreshAccessToken,
};
