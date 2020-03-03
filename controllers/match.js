const jwt = require("jsonwebtoken");
const Sport = require("../models/match");

exports.createMatch = async (req, res) => {
    try {
        const { homeTeam, awayTeam, matchDate, scoreboard, status } = req.body;
        const match = new Match({ homeTeam, awayTeam, matchDate, scoreboard, status });
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
