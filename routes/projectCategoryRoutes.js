const express = require("express");
const {
  createProjectCategory,
  getAllProjectCategories,
  getProjectCategory,
  updateProjectCategory,
  deleteProjectCategory,
} = require("../controllers/projectCategoryController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(protect, createProjectCategory)
  .get(getAllProjectCategories);
router
  .route("/:id")
  .get(protect, getProjectCategory)
  .patch(protect, updateProjectCategory)
  .delete(protect, deleteProjectCategory);

module.exports = router;
