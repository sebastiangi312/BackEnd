const express = require("express");
const SportBetAdminController = require("../controllers/sportBetAdmin");
const checkAuthAdmin = require('../middleware/check-auth-admin');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("",checkAuth ,checkAuthAdmin, SportBetAdminController.createSportBetAdmin );

module.exports = router;