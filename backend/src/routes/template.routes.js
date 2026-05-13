const express = require("express");
const { getTemplates, getTemplateById, createTemplate } = require("../controllers/template.controller");
const { verifyAdmin } = require("../middlewares/admin.middleware");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { validateTemplate } = require("../validators/template.validator");

const router = express.Router();

router.route("/")
  .get(getTemplates)
  .post(verifyJWT, verifyAdmin, validateTemplate, createTemplate);

router.route("/:id")
  .get(getTemplateById);

module.exports = router;
