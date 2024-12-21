const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const communityChat = require("../model/communityChat");
const router = express.Router();

router.get("/all-chat", checkAuth, (req, res) => {
  // console.log("req.query-------->>>", req.query);
  const { roomId } = req.query;
  if (!roomId) {
    return res.status(400).json({ message: "roomId is required" });
  }
  try {
    communityChat
      .find({ roomId: roomId })
      .then((resMsg) => {
        if (resMsg.length === 0) {
          return res.status(404).json({ msg: "No Data Found" });
        }
        res.status(200).json({ allmsg: resMsg });
      })
      .catch((err) => {
        console.log("this is err", err);
      });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat" });
  }
});

module.exports = router;
