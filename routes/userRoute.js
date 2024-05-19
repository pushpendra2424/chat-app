const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const { fileUpload } = require("../controllers/uploadController");
const upload = require("../middleware/fileUpload");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);

router.post("/login", authUser);

router.post("/uploads", upload.single("pic"), fileUpload);

module.exports = router;
