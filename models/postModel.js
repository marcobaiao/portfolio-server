const mongoose = require("mongoose");
const { Schema } = mongoose;

const postModel = new Schema({
  title: {
    type: String,
    required: [true, "A post must have a title"],
    unique: true,
  },
  thumbnailImg: {
    type: String,
  },
  description: {
    type: String,
    required: [true, "A post must have a description"],
  },
  content: {
    type: String,
    required: [true, "A post must have a content"],
  },
  active: {
    type: Boolean,
    default: false,
  },
  categories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Post Category",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Post = mongoose.model("Post", postModel);

module.exports = Post;
