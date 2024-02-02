const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: [true, "A project must have a name"],
    unique: true,
  },
  resume: {
    type: String,
    required: [true, "A project must have a resume"],
    minLength: [125, "The resume must have less or equal than 125 characters"],
  },
  thumbnailImg: {
    type: String,
  },
  images: [String],
  categories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Project Category",
    },
  ],
  description: {
    type: String,
    required: [true, "A project must have a description"],
  },
  active: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
