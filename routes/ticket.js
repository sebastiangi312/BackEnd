const express = require("express");
const TicketController = require("../controllers/ticket");
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("/lotteryTicket", checkAuth, TicketController.createLotteryTicket );

module.exports = router;