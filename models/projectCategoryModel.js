const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectCategoriesSchema = new Schema({
  name: {
    type: String,
    required: [true, "A project category must have a name"],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ProjectCategory = mongoose.model(
  "Project Category",
  projectCategoriesSchema
);

module.exports = ProjectCategory;
