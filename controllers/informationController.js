const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const Information = require("../models/informationModel");
const catchAsync = require("../utils/catchAsync");

/*const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/admin");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `admin.${ext}`);
  },
});*/

//Saving the image in memory instead of in the disk because the image will still be resized
//So only after the image is resized, it is saved in the disk
const multerStorage = multer.memoryStorage();

//Validating if files are images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadMePhoto = upload.single("photo");

exports.resizeMePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const filename = "me.jpeg";

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/${filename}`);

  req.body.photo = filename;

  next();
});

exports.createInformation = async (req, res) => {
  try {
    const information = await Information.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        information,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getInformation = async (req, res) => {
  try {
    const information = await Information.findOne();

    res.status(200).json({
      status: "success",
      data: {
        information,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateInformation = async (req, res) => {
  try {
    const information = await Information.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        information,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
