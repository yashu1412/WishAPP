const express = require("express");
const {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  loginAsGuest,
  updateProfile,
} = require("../controllers/auth.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register/email", registerWithEmail);
router.post("/login/email", loginWithEmail);
router.post("/login/google", loginWithGoogle);
router.post("/login/guest", loginAsGuest);
router.put("/profile", verifyJWT, updateProfile);

module.exports = router;
