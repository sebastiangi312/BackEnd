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

exports.closeMatch = async(req, res) => {
    try{
        const { matchId, finalScoreBoard } = req.body;
        
        const updateMatch = await Match.updateOne({_id: matchId},{finalScoreBoard, open: false});

        if (updateMatch.n > 0) {
            res.status(200).json({ message: 'Se cerró satisfactoriamente' });
        } else {
            res.status(500).json({
                message: "closing match failed!",
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        });
    }
};

exports.getOpenMatches = async (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const matchQuery = Match.find({ open: true });
    let fetchedMatches;
    if (pageSize && currentPage) {
        matchQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    matchQuery
        .then(documents => {
            fetchedMatches = documents;
            return Match.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: "Matches fetched successfully!",
                match: fetchedMatches,
                maxMatches: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching matches failed!"
            });
        });
};

exports.getNonFilledMatches = async (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const matchQuery = Match.find({ open: true});
    
    let fetchedMatches;
    if (pageSize && currentPage) {
        matchQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    matchQuery
        .then(documents => {
            fetchedMatches = documents;
            return Match.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: "Matches fetched successfully!",
                match: fetchedMatches,
                maxMatches: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching matches failed!"
            });
        });
};

exports.saveScores = async (req, res) => {
    try{
        const { matchId, homeScore, awayScore } = req.body;
        const updateMatch = await  Match.updateOne({ _id: matchId }, { finalScoreBoard: homeScore + "-" + awayScore, open: false });
        
        if (updateMatch.n > 0) {
            res.status(200).json({ message: "Resultado ingresado correctamente" });
        } else {
            res.status(401).json({ message: "Error al ingresar resultado" });
            
        }
    }catch{
        res.status(500).json({
            message: "Usuario no autorizado"
        })

    }


 };
