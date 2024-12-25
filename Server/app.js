require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

// const bodyParser = require("body-parser");

const userRoutes = require("./routes/user");

const blogRoutes = require("./routes/blog");
const commentRoutes = require("./routes/comment");
const categoryRoutes = require("./routes/category");
const communitychatRoutes = require("./routes/communityChats");
const path = require("path");
// Enable CORS for all routes /
app.use(
  cors({
    origin: process.env.REACT_CLIENT_URL, // Add allowed front-end URLs
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Add allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"], // Add allowed headers
    credentials: true, // Allow cookies to be sent with cross-origin requests
    optionsSuccessStatus: 200, // For older browsers compatibility
  })
);

mongoose
  .connect(process.env.MONGODB_URL)
  .then((res) => {
    console.log("connected Databases");
  })
  .catch((err) => {
    console.log("this is err", err);
  });

// Use built-in JSON parser middleware
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);
app.use("/comment", commentRoutes);
app.use("/category", categoryRoutes);
app.use("/community-chat", communitychatRoutes);

module.exports = app;
