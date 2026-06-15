const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  purpose: {
    type: String,
    enum: ["register", "forgot-password"],
    required: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL → auto delete after 3 minutes
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 });

// ONE OTP PER EMAIL + PURPOSE
otpSchema.index({ email: 1, purpose: 1 }, { unique: true });

module.exports = mongoose.model("Otp", otpSchema);
