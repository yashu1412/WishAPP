const express = require("express");
const { getCategories, createCategory } = require("../controllers/category.controller");
const { verifyAdmin } = require("../middlewares/admin.middleware");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/")
  .get(getCategories)
  .post(verifyJWT, verifyAdmin, createCategory);

module.exports = router;
