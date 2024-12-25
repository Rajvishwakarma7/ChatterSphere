const express = require("express");
const router = express.Router();
const category = require("../model/category");
const checkAuth = require("../middleware/checkAuth");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const upload = require("../middleware/multers");
const fs = require("fs");
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
router.delete("/delete", checkAuth, async (req, res) => {
  try {
    const { categoryId } = req.query;
    console.log("categoryId", categoryId);
    const getCategory = await category.findById({ _id: categoryId });
    if (!getCategory) {
      return res.status(404).json({ err: "Category not found !" });
    }
    if (getCategory.imageDetail && getCategory.imageDetail.path) {
      if (fs.existsSync(getCategory.imageDetail.path)) {
        fs.unlinkSync(getCategory.imageDetail.path);
      }
    }
    const deletedCat = await category.findByIdAndDelete(categoryId);
    return res
      .status(200)
      .json({ msg: "Category deleted successfully", deletedCat });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ err: error.message });
  }
});

// update

router.put("/update", checkAuth, upload.single("image"), async (req, res) => {
  try {
    const { categoryId } = req.query;
    const { title, description } = req.body;
    const getCategory = await category.findById({ _id: categoryId });
    if (!getCategory) {
      return res.status(404).json({ err: "Category not found !" });
    }
    if (getCategory.imageDetail && getCategory.imageDetail.path) {
      if (fs.existsSync(getCategory.imageDetail.path)) {
        fs.unlinkSync(getCategory.imageDetail.path);
      }
    }
    const updatedCategory = await category.findByIdAndUpdate(
      categoryId,
      {
        description: description,
        title: title,
        imageDetail: {
          filename: req.file.filename,
          path: req.file.path,
          url: `/uploads/${req.file.filename}`,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ msg: "Update Successfully", updatedCategory });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ err: error.message });
  }
});
module.exports = router;
