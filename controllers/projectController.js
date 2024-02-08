const sharp = require("sharp");
const multer = require("multer");

const catchAsync = require("../utils/catchAsync");
const Project = require("../models/projectModel");
const AppError = require("../utils/appError");

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

exports.uploadProjectImages = upload.fields([
  {
    name: "thumbnailImg",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 20,
  },
]);

exports.resizeProjectImages = catchAsync(async (req, res, next) => {
  //if (!req.files && !req.files.thumbnailImg && !req.files.images) return next();

  if (req.files) {
    //Thumbnail image
    if (req.files.thumbnailImg) {
      const thumbnailImgFilename = `proj-${Date.now()}-thumbnail.jpeg`;

      await sharp(req.files.thumbnailImg[0].buffer)
        //.resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/projects/${thumbnailImgFilename}`);

      req.body.thumbnailImg = thumbnailImgFilename;
    }

    //Images

    //req.body.images = [];

    if (req.files.images) {
      await Promise.all(
        req.files.images.map(async (image, index) => {
          const filename = `project-${Date.now()}-${index + 1}.jpeg`;

          await sharp(image.buffer)
            //.resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/images/projects/${filename}`);

          if (req.body.images === undefined) {
            req.body.images = [];
            req.body.images.push(filename);
          } else req.body.images.push(filename);
        })
      );
    }
  }

  next();
});

exports.createProject = catchAsync(async (req, res, next) => {
  const newProject = await Project.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      project: newProject,
    },
  });
});

exports.getAllProjects = catchAsync(async (req, res, next) => {
  let queryObj = req.query;

  let categoriesQuery = [];
  let findObj = {};

  if (req.query.name) findObj.name = { $regex: req.query.name, $options: "i" };

  if (queryObj.categories && JSON.parse(queryObj.categories).length > 0) {
    let categories = JSON.parse(queryObj.categories);
    categories.forEach((cat) => categoriesQuery.push({ categories: cat }));
    findObj = { ...findObj, $and: categoriesQuery };
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 6;
  const skip = (page - 1) * limit;

  if (req.query.page) {
    const projectsNum = await Project.find().countDocuments();

    if (projectsNum === 0)
      return res.status(200).json({
        status: "success",
        results: 0,
        total: 0,
        data: {
          projects: [],
        },
      });

    if (skip >= projectsNum) throw new Error("This page does not exist");
  }

  const projects = await Project.find(findObj || {})
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "categories",
      select: "-createdAt -__v",
    });

  const total = await Project.find(findObj || {}).countDocuments();

  res.status(200).json({
    status: "success",
    results: projects.length,
    total: total,
    data: {
      projects,
    },
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate({
    path: "categories",
    select: "-createdAt -__v",
  });

  if (!project) {
    return next(new AppError("No project found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return next(new AppError("No project found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return next(new AppError("No project found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});
