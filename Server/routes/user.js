const express = require("express");
const router = express.Router();
const user = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/checkAuth");
router.post("/signup", (req, res) => {
  console.log("signUp post request");

  user.find({ email: req.body.email }).then((userRes) => {
    if (userRes.length > 0) {
      return res.status(500).json({ msg: "user already Exist" });
    }
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: err,
        });
      }

      const newUser = new user({
        // _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
      });

      newUser
        .save()
        .then((result) => {
          res.status(200).json({
            newUser: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    });
  });
});

router.post("/login", (req, res) => {
  console.log("login post - request", req.body);

  user
    .find({ email: req.body.email })
    .then((userData) => {
      if (userData.length == 0) {
        return res.status(401).json({ msg: "user not exist" });
      }

      bcrypt.compare(req.body.password, userData[0].password, (err, result) => {
        if (!result) {
          return res.status(401).json({ msg: "Invalid Password" });
        }

        // creating tokon ----->>>
        const token = jwt.sign(
          {
            firstName: userData[0].firstName,
            lastName: userData[0].lastName,
            email: userData[0].email,
            userId: userData[0]._id,
          },
          "raj 28",
          { expiresIn: "365d" }
        );

        res.status(200).json({
          firstName: userData[0].firstName,
          lastName: userData[0].lastName,
          email: userData[0].email,
          userId: userData[0]._id,
          token: token,
        });
      });
    })
    .catch((err) => {
      console.log("login ----- - err", err);
    });
});

// get all users

router.get("/all-users", checkAuth, (req, res) => {
  try {
    user
      .find()
      .then((userRes) => {
        if (userRes.length <= 0) {
          return res.status(500).json({ msg: "user not found !" });
        }
        res.status(200).json(userRes);
      })
      .catch((err) => {
        res.status(500).json({ msg: err });
      });
  } catch (err) {
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;
