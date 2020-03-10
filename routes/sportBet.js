const express = require("express");
const SportBetController = require("../controllers/sportBet");;
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("", checkAuth, SportBetController.createSportBet );

module.exports = router;