const express = require("express");
const UserController = require("../controllers/user");
const checkAuth = require('../middleware/check-auth');
const checkAuthAdmin = require('../middleware/check-auth-admin');

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.put("/userAuth", checkAuth, checkAuthAdmin,UserController.authorizeUser);

router.get("/:userId", checkAuth, UserController.getCurrentUser);

router.put("/:userId", checkAuth, UserController.editUser);


module.exports = router;
