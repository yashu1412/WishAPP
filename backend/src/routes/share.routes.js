const express = require("express");
const { recordShare, getShareHistory } = require("../controllers/share.controller");

const router = express.Router();

router.post("/", recordShare);
router.get("/history", getShareHistory);

module.exports = router;
