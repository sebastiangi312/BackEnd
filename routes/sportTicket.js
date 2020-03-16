const express = require("express");
const SportTicketController = require("../controllers/sportTicket");;
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("", checkAuth, SportTicketController.createSportTicket);

module.exports = router;