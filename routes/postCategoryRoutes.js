const express = require("express");
const {
  createPostCategory,
  getAllPostCategories,
  getPostCategory,
  updatePostCategory,
  deletePostCategory,
} = require("../controllers/postCategoryController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/").post(protect, createPostCategory).get(getAllPostCategories);
router
  .route("/:id")
  .get(protect, getPostCategory)
  .patch(protect, updatePostCategory)
  .delete(protect, deletePostCategory);

module.exports = router;
