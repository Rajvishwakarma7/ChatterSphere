const mongoose = require("mongoose");
const blogsSchema = mongoose.Schema({
  userId: { type: String, required: true },
  blog_title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: { type: String },
    public_id: { type: String },
  },
  categoryId: { type: String, required: true },
  userName: { type: String, required: true },
});

module.exports = mongoose.model("blogs", blogsSchema);
