const express = require("express");
const SportTicketController = require("../controllers/sportTicket");;
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("", checkAuth, SportTicketController.createSportTicket );
router.post("/setSportWinners", checkAuth, SportTicketController.setSportWinners );

module.exports = router;