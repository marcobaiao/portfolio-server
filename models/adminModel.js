const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const bcrypt = require("bcryptjs");

const adminSchema = new Schema({
  name: {
    type: String,
    required: [true, "The admin must have a name"],
  },
  email: {
    type: String,
    required: [true, "The admin must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "The admin must have a valid email"],
  },
  password: {
    type: String,
    required: [true, "The admin must have a password"],
    minLength: 8,
    //not sent in res
    select: false,
  },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

adminSchema.methods.isPasswordCorrect = async function (
  passwordToCheck,
  userPassword
) {
  return await bcrypt.compare(passwordToCheck, userPassword);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
