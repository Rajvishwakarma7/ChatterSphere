const express = require("express");
const router = express.Router();
const category = require("../model/category");
const checkAuth = require("../middleware/checkAuth");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const upload = require("../middleware/multers");

// add category ---
router.post("/", checkAuth, upload.single("image"), (req, res) => {
  // console.log("req for category ", req.body);
  let getAllCategory = category.find({ title: req.body.title });
  getAllCategory.then((res_db) => {
    if (res_db.length > 0) {
      return res.status(500).json({ msg: "title already used" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const { userId, title, description } = req.body;

    const newCategory = new category({
      // _id: new mongoose.Types.ObjectId(),
      userId: userId,
      title: title,
      description: description,
      imageDetail: {
        filename: req.file.filename,
        path: req.file.path,
        url: `/uploads/${req.file.filename}`, // Save the relative URL
      },
    });

    newCategory
      .save()
      .then((savedCategory) => {
        console.log("this is created Category-", savedCategory);
        return res.status(200).json({ msg: savedCategory });
      })
      .catch((err) => {
        return res.status(201).json({ msg: err });
      });
  });
});

// get all categry
router.get("/", checkAuth, (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  let isVarify = jwt.verify(token, "raj 28");
  if (isVarify) {
    try {
      category
        .find({ userId: isVarify.userId })
        // .select("_id userId title imageUrl discription")
        .then((savedCategory) => {
          const baseUrl = `${req.protocol}://${req.get("host")}`;
          if (savedCategory.length > 0) {
            const categoriesWithFullUrl = savedCategory.map((categoryItems) => {
              categoryItems.imageDetail.url = `${baseUrl}${categoryItems.imageDetail.url}`;
              return categoryItems;
            });
            res.status(200).json({ allCategory: categoriesWithFullUrl });
          } else {
            res.status(200).json({ allCategory: [] });
          }
        })
        .catch((typeError) => {
          return res.status(400).json({ err: typeError });
        });
    } catch (error) {
      return res.status(400).json({ err: error });
    }
  }
});

//delete category
router.delete("/:id", checkAuth, (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  let isVarify = jwt.verify(token, "raj 28");

  category
    .deleteOne({ _id: req.params.id, userId: isVarify.userId })
    // .findOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount == 0) {
        return res.status(401).json({
          msg: "somethng went wrong , token invalid !",
          deleted_data: result,
        });
      }

      res.status(200).json({ msg: "category delected", deleted_data: result });
    })
    .catch((typeError) => {
      return res.status(201).json({ err: typeError });
    });
});

// update

router.put("/update", checkAuth, (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  let isVarify = jwt.verify(token, "raj 28");

  if (!req.body.id) {
    return res.status(400).json({ msg: "id is required" });
  }

  category
    .findOneAndUpdate(
      { _id: req.body.id, userId: isVarify.userId },
      {
        $set: {
          userId: isVarify.userId,
          title: req.body.title,
          imageUrl: req.body.imageUrl,
          discription: req.body.discription,
        },
      },
      { new: true }
    )
    .then((result) => {
      if (result == null) {
        return res.status(400).json({ msg: "item not found" });
      }
      res.status(200).json({ msg: result });
    })
    .catch((typeError) => {
      return res
        .status(404)
        .json({ msg: "Category not found or unauthorized" });
    });
});
module.exports = router;
