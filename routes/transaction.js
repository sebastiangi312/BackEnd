const express = require("express");
const UserController = require("../controllers/user");
const checkAuth = require('../middleware/check-auth');
const checkAuthAdmin = require('../middleware/check-auth-admin');
const TransactionController = require("../controllers/transaction");

const router = express.Router();

router.get("", checkAuth, checkAuthAdmin, TransactionController.getNonApprovedTransactions);
router.get("", checkAuth, checkAuthAdmin, TransactionController.getTransactions);
router.put("/edit/:id", checkAuth, checkAuthAdmin, TransactionController.approveTransaction);
router.post("", checkAuth, TransactionController.createTransaction);

router.put("/chargeAuth", checkAuth, checkAuthAdmin, TransactionController.chargeMoney);
router.get("/chargeDeauth", checkAuth, checkAuthAdmin, TransactionController.deleteCharge);
router.get("/transactionName", checkAuth, checkAuthAdmin, TransactionController.getTransactionUser);


module.exports = router;