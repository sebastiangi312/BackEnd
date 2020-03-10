const jwt = require("jsonwebtoken");
const Sport = require("../models/match");

exports.createMatch = async (req, res) => {
    try {
        const { homeTeam, awayTeam, matchDate } = req.body;
        const match = new Match({ homeTeam, awayTeam, matchDate, winningScore: "", status: true });
        const result = await match.save();
        res.status(201).json({
            message: "Partido creado satisfactoriamente",
            result: result
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
