const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  imageDetail: {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    url: { type: String, required: true },
  },
  description: { type: String, required: true },
});

module.exports = mongoose.model("category", categorySchema);
