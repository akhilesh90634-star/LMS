const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

async function verifyToken(req) {
  const header = req.headers.authorization;

  if (!header) return { error: "No token" };

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id);

    if (!user) return { error: "User not found" };

    return { user };
  } catch {
    return { error: "Invalid token" };
  }
}

// ADMIN ONLY
async function adminAuth(req, res, next) {
  const result = await verifyToken(req);

  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  if (result.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  req.userId = result.user._id;
  req.userRole = result.user.role;

  next();
}

// TRAINER ONLY
async function trainerAuth(req, res, next) {
  const result = await verifyToken(req);

  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  if (result.user.role !== "trainer") {
    return res.status(403).json({ message: "Trainer only" });
  }

  req.userId = result.user._id;
  req.userRole = result.user.role;

  next();
}

// STUDENT ONLY
async function studentAuth(req, res, next) {
  const result = await verifyToken(req);

  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  if (result.user.role !== "student") {
    return res.status(403).json({ message: "Student only" });
  }

  req.userId = result.user._id;
  req.userRole = result.user.role;

  next();
}

// ADMIN OR TRAINER
async function adminOrTrainerAuth(req, res, next) {
  const result = await verifyToken(req);

  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  if (!["admin", "trainer"].includes(result.user.role)) {
    return res.status(403).json({ message: "Admin or Trainer only" });
  }

  req.userId = result.user._id;
  req.userRole = result.user.role;

  next();
}

// ALL ROLES
async function authAllRoles(req, res, next) {
  const result = await verifyToken(req);

  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  req.userId = result.user._id;
  req.userRole = result.user.role;

  next();
}

module.exports = {
  adminAuth,
  trainerAuth,
  studentAuth,
  adminOrTrainerAuth,
  authAllRoles,
};
