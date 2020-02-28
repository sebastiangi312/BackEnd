const express = require("express");
const UserController = require("../controllers/user");
const checkAuth = require('../middleware/check-auth');
const checkAuthAdmin = require('../middleware/check-auth-admin');

const TransactionController = require("../controllers/transaction");

const router = express.Router();

router.get("", checkAuth, TransactionController.getSelectedTransaction);
router.put("/edit/:id", checkAuth, checkAuthAdmin, TransactionController.approveTransaction);
router.post("", checkAuth, checkAuthAdmin, TransactionController.createTransaction);

module.exports = router;