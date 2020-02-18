const express = require("express");
const UserController = require("../controllers/user");
const checkAuth = require('../middleware/check-auth');

const LotteryController = require("../controllers/lottery");

const router = express.Router();

router.get("", BetsController.getLotteries);