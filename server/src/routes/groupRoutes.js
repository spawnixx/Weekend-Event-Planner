const express = require("express");
const router = new express.Router();
const ExpressError = require("../middleware/expressError");
const Group = require("../models/groupModel");
const tokenAuth = require("../middleware/tokenAuth");
const { create } = require("../controllers/groupController");

router.get("/", tokenAuth);
router.get("/:id", tokenAuth);

router.post("/create", tokenAuth, create);
// router.post("/:id/join", tokenAuth, join);
module.exports = router;
