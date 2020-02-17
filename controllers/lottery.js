const jwt = require("jsonwebtoken");
const Lottery = require("../models/lottery");

exports.createLottery = async (req, res) => {
    try {
        const { id, ticket, fare, closingDate, firstPrize, secondPrize, thirdPrize } = req.body;
        const lottery = new Lottery({ id, ticket, fare, closingDate, firstPrize, secondPrize, thirdPrize, creationDate : new Date(), open : true });
        const result = await lottery.save();
        res.status(201).json({
            message: "Lottery created succesfully",
            result: result
        });
    }catch (err) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// escoger una loteria de una lista de loterias existentes (que no se hacer)
exports.selectLottery = async (req, res) => {

};

exports.getSelectedLottery = async (req, res) => {
    try {
        const lottery = await Lottery.findById(req.params.lotteryId);
        // asigna variables de la loteria seleccionada
        const id = lottery.id;
        const ticket = lottery.ticket;
        const fare = lottery.fare;
        const closingDate = lottery.closingDate;
        const creationDate = lottery.creationDate;
        const firstPrize = lottery.firstPrize;
        const secondPrize = lottery.secondPrize;
        const thirdPrize = lottery.thirdPrize;
        const open = lottery.open;
        const lotteryData = {id, ticket, fare, closingDate, creationDate, firstPrize, secondPrize,
                             thirdPrize, open}
        res.status(200).json(lotteryData);
    } catch (err) {
        return res.status(401).json({
            message: "Error retrieving Lottery"
        });
    }
};

exports.editSelectedLottery = async (req, res) => {
    try {
        const { open, closingDate, fare } = req.body;
        const lottery = await Lottery.findById(req.params.lotteryId);
        const result = await Lottery.updateOne({ open: req.params.open} , {closingDate: req.params.closingDate},
                                                {fare: req.params.fare})
        if (result.n > 0) {
            res.status(200).json({ message: "Update successful!" });
        } else {
            res.status(401).json({ message: "Not authorized!" });
        }                                        
    } catch (err) {
        res.status(500).json({
            message: "Couldn't udpate post!"
        });
    }
};