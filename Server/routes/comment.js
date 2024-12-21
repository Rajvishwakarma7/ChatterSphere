const express = require("express");
const router = express.Router();
const comment = require("../model/comment");
const checkAuth = require("../middleware/checkAuth");
const jwt = require("jsonwebtoken");

// new comment
router.post("/create", checkAuth, (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let isVerify = jwt.verify(token, "raj 28");

    const new_comments = new comment({
      blogId: req.body.blogId,
      comments: req.body.comments,
    });
    new_comments
      .save()
      .then((result) => {
        console.log("result", result);
        res.status(200).json({ msg: "Comment  successfully", result });
      })
      .catch((error) => {
        console.log("error", error);
        return res.status(201).json({ msg: error });
      });
  } catch (err) {
    console.log("result--", err);
    return res.status(201).json({ msg: err });
  }
});

// update the comment
router.put("/update", checkAuth, (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  let isVerify = jwt.verify(token, "raj 28");
  const { _id, comments, blogId } = req.body;
  if (!_id || !blogId) {
    return res.status(201).json({ msg: "id and blogId is required" });
  }

  comment
    .findOneAndUpdate(
      { _id: _id, blogId: blogId },
      {
        $set: {
          blogId: blogId,
          comments: comments,
        },
      },
      { new: true }
    )
    .then((result) => {
      if (result == null) {
        return res.status(201).json({ msg: "comments not found" });
      }
      console.log("result", result);
      res.status(200).json({ msg: "Comment update  successfully", result });
    })
    .catch((error) => {
      console.log("error", error);
      return res.status(201).json({ msg: error });
    });
});

// get all comments

router.get("/", checkAuth, (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  let isVerify = jwt.verify(token, "raj 28");
  comment
    .find({ userId: isVerify.userId })
    .then((result) => {
      if (result.length == 0) {
        return res.status(201).json({ msg: " No comments  found" });
      }
      console.log("result", result);
      res.status(200).json({ msg: "Comment update  successfully", result });
    })
    .catch((error) => {
      console.log("error", error);
      return res.status(201).json({ msg: error });
    });
});

// get  comments blog wise

router.get("/get-blog-wise", checkAuth, (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  let isVerify = jwt.verify(token, "raj 28");

  if (!req.query.blogId) {
    return res.status(404).json({ msg: "blogId  is required" });
  }
  comment
    .find({ blogId: req.query.blogId })
    .then((result) => {
      if (result.length == 0) {
        return res.status(201).json({ msg: " No comments  found" });
      }
      res.status(200).json({ msg: "comments related blogs", result });
    })
    .catch((error) => {
      console.log("error", error);
      return res.status(201).json({ msg: error });
    });
});

module.exports = router;
