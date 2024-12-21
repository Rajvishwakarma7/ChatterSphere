const mongoose = require("mongoose");
const communityChatSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  roomId: { type: String },
  receiverId: { type: String },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("communitychat", communityChatSchema);
