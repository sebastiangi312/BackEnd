const express = require("express");
const TicketController = require("../controllers/ticket");
const checkAuth = require('../middleware/check-auth');
const checkAuthBettor = require('../middleware/check-auth-bettor');

const router = express.Router();

router.post("/lotteryTicket", checkAuth, checkAuthBettor ,TicketController.createLotteryTicket);

module.exports = router;