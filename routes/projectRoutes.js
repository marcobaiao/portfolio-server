const express = require("express");
const {
  getAllProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  uploadProjectImages,
  resizeProjectImages,
} = require("../controllers/projectController");

const router = express.Router();

router
  .route("/")
  .get(getAllProjects)
  .post(uploadProjectImages, resizeProjectImages, createProject);
router
  .route("/:id")
  .get(getProject)
  .patch(uploadProjectImages, resizeProjectImages, updateProject)
  .delete(deleteProject);

module.exports = router;
