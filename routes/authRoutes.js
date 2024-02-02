const express = require("express");
const { login, refreshToken } = require("../controllers/authController");

const router = express.Router();

router.route("/login").post(login);
router.route("/refresh").post(refreshToken);

module.exports = router;
