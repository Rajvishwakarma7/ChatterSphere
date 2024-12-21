const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const blogs = require("../model/blog");
const router = express.Router();
const jwt = require("jsonwebtoken");
const upload = require("../middleware/multers");
const uploadOnCloudinary = require("../middleware/cloudinary");
const cloudinary = require("cloudinary").v2;
// create
router.post(
  "/create",
  checkAuth,
  upload.single("image"),
  uploadOnCloudinary,
  (req, res) => {
    const getblogItems = blogs.find({ blog_title: req.body.blog_title });
    getblogItems
      .then((result) => {
        if (result.length > 0) {
          if (res.headersSent) {
            return;
          }
          return res.status(201).json({ msg: "blog title is already used" });
        }
        let token = req.headers.authorization.split(" ")[1];
        let isVarify = jwt.verify(token, "raj 28");

        // console.log("req.cloudinaryData", req.cloudinaryData);
        // console.log("req ---->>", req.body);

        const blog_item = new blogs({
          userId: isVarify.userId,
          blog_title: req.body.blog_title,
          description: req.body.description,
          image: {
            url: req.cloudinaryData.url,
            public_id: req.cloudinaryData.public_id,
          },
          categoryId: req.body.categoryId,
          userName: isVarify.firstName + " " + isVarify.lastName,
        });
        blog_item
          .save()
          .then((savedBlog) => {
            console.log("this is created Blogs-", savedBlog);

            if (res.headersSent) {
              console.log("Response already sent.");
              return;
            }

            res.status(200).json({ blogCreated: savedBlog });
          })
          .catch((err) => {
            return res.status(500).json({ msg: err });
          });
      })
      .catch((err) => {
        console.error("Error in blogs.find:", err);
        res
          .status(500)
          .json({ msg: "Error finding blog title", error: err.message });
      });
  }
);

// get blog by category ----->
router.get("/", checkAuth, (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  let isVarify = jwt.verify(token, "raj 28");
  if (!req.query.categoryId) {
    return res.status(404).json({ msg: "category is required" });
  }
  blogs
    .find({ userId: isVarify.userId, categoryId: req.query.categoryId })
    .then((result) => {
      res.status(200).json({ blogs: result });
    })
    .catch((err) => {
      return res.status(500).json({ msg: err });
    });
});

// Update blog route
router.put("/update", checkAuth, (req, res) => {
  try {
    // Extract token from Authorization header
    let token = req.headers.authorization.split(" ")[1];
    let isVerify = jwt.verify(token, "raj 28");

    // Check if the required fields 'categoryId' and 'id' are present
    if (!req.body.categoryId || !req.body.id) {
      return res
        .status(400)
        .json({ msg: "Please provide valid 'categoryId' and 'id' fields." });
    }

    // Perform the update operation
    blogs
      .findOneAndUpdate(
        {
          categoryId: req.body.categoryId,
          _id: req.body.id,
          userId: isVerify.userId, // Ensure the user is authorized
        },
        {
          $set: {
            userId: isVerify.userId, // Ensure the user ID is correctly set
            blog_title: req.body.blog_title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            categoryId: req.body.categoryId,
          },
        },
        { new: true } // Return the updated blog
      )
      .then((updatedBlog) => {
        // If no document is found, return 400 with appropriate message
        if (!updatedBlog) {
          return res.status(404).json({ msg: "Blog not found" });
        }

        // Log the updated blog for debugging
        console.log("Updated Blog:", updatedBlog);

        // Return the updated blog as a response
        res.status(200).json({ msg: "Blog updated successfully", updatedBlog });
      })
      .catch((error) => {
        // Catch any errors during the query execution
        console.error("Error updating blog:", error);
        return res
          .status(500)
          .json({ msg: "Error updating the blog", error: error.message });
      });
  } catch (err) {
    // Handle token verification errors
    console.error("JWT Verification Error:", err);
    return res
      .status(403)
      .json({ msg: "Invalid or expired token", error: err.message });
  }
});

// delete blog
router.delete("/", checkAuth, async (req, res) => {
  try {
    if (!req.body.id) {
      return res
        .status(400)
        .json({ msg: "Please provide a valid 'id' field." });
    }

    // Find the blog by ID
    const blog = await blogs.findById(req.body.id);
    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    // Check and delete image from Cloudinary
    if (blog.image?.public_id) {
      try {
        const result = await cloudinary.uploader.destroy(
          blog.image.public_id.trim()
        );
        if (result.result === "not found") {
          console.warn(
            "Image not found in Cloudinary for public_id:",
            blog.image.public_id
          );
        }
      } catch (cloudErr) {
        console.error("Cloudinary error:", cloudErr);
        return res
          .status(500)
          .json({ msg: "Error deleting image from Cloudinary", cloudErr });
      }
    }

    // Delete blog from database
    const deletedBlog = await blogs.findByIdAndDelete(req.body.id);
    console.log("Deleted blog:", deletedBlog);

    return res
      .status(200)
      .json({ msg: "Blog deleted successfully", deletedBlog });
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(500)
      .json({ msg: "An error occurred while deleting the blog.", err });
  }
});

router.post("/uploadImage", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // console.log("this is req file req.file----------->>>>", req.file);
    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "File upload failed", error: error.message });
  }
});
module.exports = router;
