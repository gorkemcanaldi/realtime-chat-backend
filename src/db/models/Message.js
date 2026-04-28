const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: String,
  username: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);
