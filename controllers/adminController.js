const Admin = require("../models/adminModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");

exports.createAdmin = async (req, res, next) => {
  try {
    const adminObj = {
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      password: req.body.password,
    };

    if (req.file) adminObj.photo = req.file.filename;

    const newAdmin = await Admin.create(adminObj);

    //Remove the password from the output
    newAdmin.password = undefined;

    res.status(200).json({
      status: "success",
      data: {
        admin: newAdmin,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findOne();

  if (!admin) {
    res.status(404).json({
      status: "fail",
      message: "No admin found",
    });
    //return next(new AppError("No admin found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      admin,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const admin = await Admin.findOne({ _id: req.params.id });

  if (!admin) {
    return next(new AppError("The admin with the specified id does not exist"));
  }

  admin.password = req.body.password;

  await admin.save();

  //Remove the password from the output
  admin.password = undefined;

  res.status(200).json({
    status: "success",
    data: {
      admin,
    },
  });
});

exports.updateAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findOne({ _id: req.params.id });

  if (!admin) {
    return next(new AppError("The admin with the specified id does not exist"));
  }

  await admin.save();

  res.status(200).json({
    status: "success",
    data: {
      admin,
    },
  });
});
