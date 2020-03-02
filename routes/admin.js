const express = require("express");
const checkAuth = require('../middleware/check-auth');
const checkAuthAdmin = require('../middleware/check-auth-admin');

const AdminController = require("../controllers/admin");

const router = express.Router();

router.get("/globalBalance", checkAuth, checkAuthAdmin, AdminController.getGlobalBalance);
router.put("/edit/globalBalance", checkAuth, checkAuthAdmin, AdminController.editGlobalBalance);

module.exports = router;