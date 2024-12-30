require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const commentRoutes = require("./routes/comment");
const categoryRoutes = require("./routes/category");
const communitychatRoutes = require("./routes/communityChats");

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: process.env.REACT_CLIENT_URL, // Dynamically handled based on environment
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Database Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error("Database connection error:", err));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);
app.use("/comment", commentRoutes);
app.use("/category", categoryRoutes);
app.use("/community-chat", communitychatRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
