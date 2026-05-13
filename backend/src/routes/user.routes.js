const express = require("express");
const { getProfile, updateProfile, updatePhoto } = require("../controllers/user.controller");
const { validateUpdateProfile } = require("../validators/user.validator");
const { upload } = require("../middlewares/upload.middleware");

const router = express.Router();

router.get("/me", getProfile);
router.put("/profile", validateUpdateProfile, updateProfile);
router.put("/photo", upload.single("photo"), updatePhoto);

module.exports = router;
