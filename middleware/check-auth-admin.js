const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async(req, res, next) => {
    try {
        const reqUser = await User.findById(req.userData.userId);
        if(reqUser.roles.admin){
            next();
        }        
      } catch (error) {
        res.status(401).json({ message: "No estás autenticado como administrador" });
      }
};

