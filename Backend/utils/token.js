const jwt = require("jsonwebtoken");

function AccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "6h",
    },
  );
}

function RefreshToken(user) {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );
}

module.exports = {
  AccessToken,
  RefreshToken,
};
