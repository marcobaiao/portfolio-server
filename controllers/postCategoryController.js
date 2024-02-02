const PostCategory = require("../models/postCategoryModel");
const catchAsync = require("../utils/catchAsync");

exports.createPostCategory = catchAsync(async (req, res, next) => {
  const newPostCategory = await PostCategory.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      postCategory: newPostCategory,
    },
  });
});

exports.getAllPostCategories = catchAsync(async (req, res, next) => {
  const postCategories = await PostCategory.find();

  res.status(200).json({
    status: "success",
    result: postCategories.length,
    data: {
      postCategories,
    },
  });
});

exports.getPostCategory = catchAsync(async (req, res, next) => {
  const postCategory = await PostCategory.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      postCategory,
    },
  });
});

exports.updatePostCategory = catchAsync(async (req, res, next) => {
  const postCategory = await PostCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      //this returns the document in the state that it is after the update instead of the previous state
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      postCategory: postCategory,
    },
  });
});

exports.deletePostCategory = catchAsync(async (req, res, next) => {
  await PostCategory.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});
