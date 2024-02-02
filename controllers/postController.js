const Post = require("../models/postModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");

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

exports.uploadPostImages = upload.single("thumbnailImg");

exports.resizePostImages = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `post-${Date.now()}-thumbnail.jpeg`;

  await sharp(req.file.buffer)
    //.resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/posts/${filename}`);

  req.body.thumbnailImg = filename;

  next();
});

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      post: newPost,
    },
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  let queryObj = req.query;

  let categoriesQuery = [];
  let findObj = {};

  if (req.query.title)
    findObj.title = { $regex: req.query.title, $options: "i" };

  if (queryObj.categories && JSON.parse(queryObj.categories).length > 0) {
    let categories = JSON.parse(queryObj.categories);
    categories.forEach((cat) => categoriesQuery.push({ categories: cat }));
    findObj = { ...findObj, $and: categoriesQuery };
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 6;
  const skip = (page - 1) * limit;

  if (req.query.page) {
    const postsNum = await Post.find().countDocuments();

    if (postsNum === 0)
      return res.status(200).json({
        status: "success",
        results: 0,
        total: 0,
        data: {
          posts: [],
        },
      });

    if (skip >= postsNum) throw new Error("This page does not exist");
  }

  const posts = await Post.find(findObj || {})
    .skip(skip)
    .limit(limit)
    .populate({
      path: "categories",
      select: "-createdAt -__v",
    });

  const total = await Post.find(findObj || {}).countDocuments();

  res.status(200).json({
    status: "success",
    results: posts.length,
    total: total,
    data: {
      posts,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate({
    path: "categories",
    select: "-createdAt -__v",
  });

  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(new AppError("No post found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});
