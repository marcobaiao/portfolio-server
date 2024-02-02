const express = require("express");
const {
  getInformation,
  createInformation,
  updateInformation,
  uploadMePhoto,
  resizeMePhoto,
} = require("../controllers/informationController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(getInformation)
  .post(protect, uploadMePhoto, resizeMePhoto, createInformation);
router
  .route("/:id")
  .patch(protect, uploadMePhoto, resizeMePhoto, updateInformation);

module.exports = router;
