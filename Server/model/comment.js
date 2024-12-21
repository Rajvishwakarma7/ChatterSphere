const mongoose = require("mongoose");
const commentSchema = mongoose.Schema({
  comments: { type: String, required: true },
  blogId: { type: String, required: true },
});

module.exports = mongoose.model("comment", commentSchema);
