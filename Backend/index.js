require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const AuthRoutes = require("./routes/AuthRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS Backend Running Successfully",
  });
});

// Auth Routes
app.use("/auth", AuthRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
