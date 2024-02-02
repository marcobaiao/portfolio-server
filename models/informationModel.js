const mongoose = require("mongoose");
const { Schema } = mongoose;

const informationModel = new Schema({
  photo: {
    type: String,
  },
  description: {
    type: String,
    required: [true, "The information must have a description"],
    maxLength: [
      125,
      "The information must have less or equal than 125 characters",
    ],
  },
});

const Information = mongoose.model("Information", informationModel);

module.exports = Information;
