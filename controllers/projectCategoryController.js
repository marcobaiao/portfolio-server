const ProjectCategory = require("../models/projectCategoryModel");
const catchAsync = require("../utils/catchAsync");

exports.createProjectCategory = catchAsync(async (req, res, next) => {
  const newProjectCategory = await ProjectCategory.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      projectCategory: newProjectCategory,
    },
  });
});

exports.getAllProjectCategories = catchAsync(async (req, res, next) => {
  const projectCategories = await ProjectCategory.find();

  res.status(200).json({
    status: "success",
    result: projectCategories.length,
    data: {
      projectCategories,
    },
  });
});

exports.getProjectCategory = catchAsync(async (req, re, next) => {
  const projectCategory = await ProjectCategory.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      projectCategory,
    },
  });
});

exports.updateProjectCategory = catchAsync(async (req, res, next) => {
  const projectCategory = await ProjectCategory.findByIdAndUpdate(
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
      projectCategory: projectCategory,
    },
  });
});

exports.deleteProjectCategory = catchAsync(async (req, res, next) => {
  await ProjectCategory.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});
