const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const MessageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  _createdtime_: {
    type: Date,
    default: Date.now
  }
});

module.exports = Message = mongoose.model("messages", MessageSchema);