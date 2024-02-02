const mongoose = require("mongoose");
const { Schema } = mongoose;

const postCategoriesSchema = new Schema({
  name: {
    type: String,
    required: [true, "A post category must have a name"],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const PostCategory = mongoose.model("Post Category", postCategoriesSchema);

module.exports = PostCategory;
