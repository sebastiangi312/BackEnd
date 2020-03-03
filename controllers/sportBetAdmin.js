const jwt = require("jsonwebtoken");
const Sport = require("../models/sportBetAdmin");

exports.createSportBetAdmin = async (req, res) => {
    try {
        console.log(req.body);
        const { finalDate, matches } = req.body;
        const sportBetAdmin = new Sport({ finalDate, matches });
        const result = await sportBetAdmin.save();
        res.status(201).json({
            message: "Apuesta deportiva creada satisfactoriamente",
            result: result
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
