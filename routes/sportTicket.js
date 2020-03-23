const express = require("express");
const SportTicketController = require("../controllers/sportTicket");;
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("", checkAuth, SportTicketController.createSportTicket );
router.put("/setSportWinners", checkAuth, SportTicketController.setSportWinners );
router.get("/showSportTickets", SportTicketController.showSportTickets );
module.exports = router;