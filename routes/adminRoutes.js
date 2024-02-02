const express = require("express");

const {
  createAdmin,
  getAdmin,
  updateAdmin,
  updatePassword,
  uploadAdminPhoto,
  resizeAdminPhoto,
} = require("../controllers/adminController");

const router = express.Router();

router.route("/").post(createAdmin).get(getAdmin);
router.route("/:id").patch(updateAdmin);
router.route("/:id/updatePassword").patch(updatePassword);

module.exports = router;
