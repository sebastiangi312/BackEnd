const express = require("express");
const UserController = require("../controllers/user");
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/:userId", checkAuth, UserController.getCurrentUser);

router.put("/:userId", checkAuth, UserController.editUser);

module.exports = router;
