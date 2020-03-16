const express = require("express");
const MatchController = require("../controllers/match");
const checkAuth = require('../middleware/check-auth');
const checkAuthAdmin = require('../middleware/check-auth-admin');

const router = express.Router();

router.post("", checkAuth, checkAuthAdmin, MatchController.createMatch );
router.get("", checkAuth, MatchController.getMatches );
router.put("/close",checkAuth, checkAuthAdmin, MatchController.closeMatch);

router.get("/openMatches",checkAuth, checkAuthAdmin, MatchController.getOpenMatches);
router.get("/nonFilled",checkAuth, checkAuthAdmin, MatchController.getNonFilledMatches);
router.put("/saveScores", checkAuth, checkAuthAdmin, MatchController.saveScores);

module.exports = router;