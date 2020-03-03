const express = require("express");
const MatchController = require("../controllers/match");
const checkAuthAdmin = require('../middleware/check-auth-admin');

const router = express.Router();

router.post("/match", checkAuthAdmin, MatchController.createMatch );

module.exports = router;