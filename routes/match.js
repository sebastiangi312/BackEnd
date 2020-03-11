const express = require("express");
const MatchController = require("../controllers/match");
const checkAuth = require('../middleware/check-auth');
const checkAuthAdmin = require('../middleware/check-auth-admin');

const router = express.Router();

router.post("", checkAuth, checkAuthAdmin, MatchController.createMatch );
router.get("", checkAuth, MatchController.getMatches );

module.exports = router;