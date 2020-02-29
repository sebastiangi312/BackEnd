const express = require("express");
const checkAuth = require('../middleware/check-auth');
const checkAuthAdmin = require('../middleware/check-auth-admin');

const LotteryController = require("../controllers/lottery");

const router = express.Router();

router.get("", checkAuth, LotteryController.getLotteries);
router.delete("/delete/:id", checkAuth, checkAuthAdmin, LotteryController.deleteLottery);
router.put("/edit/:id", checkAuth, checkAuthAdmin, LotteryController.editLottery);
router.post("", checkAuth, checkAuthAdmin, LotteryController.createLottery);

module.exports = router;