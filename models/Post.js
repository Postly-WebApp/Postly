const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    comments: {
      type: Array,
      default: [],
    },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
