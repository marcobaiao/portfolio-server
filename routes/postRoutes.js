const express = require("express");
const {
  createPost,
  getAllPosts,
  updatePost,
  getPost,
  deletePost,
  uploadPostImages,
  resizePostImages,
} = require("../controllers/postController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(protect, uploadPostImages, resizePostImages, createPost)
  .get(getAllPosts);
router
  .route("/:id")
  .patch(protect, uploadPostImages, resizePostImages, updatePost)
  .get(getPost)
  .delete(protect, deletePost);

module.exports = router;
