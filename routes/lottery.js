const express = require("express");
const UserController = require("../controllers/user");
const checkAuth = require('../middleware/check-auth');

const LotteryController = require("../controllers/posts");

const router = express.Router();

router.get("", BetsController.getLotteries);