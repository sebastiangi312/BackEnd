const jwt = require("jsonwebtoken");
const Match = require("../models/match");

exports.createMatch = async (req, res) => {
    try {
        const { homeTeam, awayTeam, matchDate, open } = req.body;
        const match = new Match({ homeTeam, awayTeam, matchDate, open });
        const result = await match.save();
        res.status(201).json({
            message: "Partido creado satisfactoriamente",
            result: result
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.getMatches = async (req, res) => {
    try {
        const matches = await Match.find();
        res.status(200).json({
            message: "Matches encontrados satisfactoriamente",
            result: matches
        });
    } catch {
        res.status(500).json({
            message: "Fallo encontrando los matches"
        });
    }
};
