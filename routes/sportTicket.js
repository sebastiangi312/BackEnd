const express = require("express");
const SportTicketController = require("../controllers/sportTicket");
const checkAuth = require('../middleware/check-auth');
const checkAuthBettor = require('../middleware/check-auth-bettor');

const router = express.Router();

router.post("", checkAuth, checkAuthBettor,SportTicketController.createSportTicket );
router.put("/setSportWinners", checkAuth, SportTicketController.setSportWinners );

module.exports = router;