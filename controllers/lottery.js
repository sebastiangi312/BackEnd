const jwt = require("jsonwebtoken");
const Lottery = require("../models/lottery");
const Ticket = require("../models/ticket")

exports.createLottery = async (req, res) => {
    try {
        const { fare, closingDate, firstPrize, secondPrize, thirdPrize } = req.body;
        const lottery = new Lottery({ fare, closingDate, firstPrize, secondPrize, thirdPrize, creationDate: new Date(), open: true });
        const result = await lottery.save();
        res.status(201).json({
            message: "Lotería creada satisfactoriamente",
            result: result
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.getLotteries = async (req, res) => {
    try {
        const lotteries = await Lottery.find();
        res.status(200).json({
            message: "Loterías encontradas satisfactoriamente",
            result: lotteries
        });
    } catch {
        res.status(500).json({
            message: "Fallo encontrando las loterías"
        });
    }
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
        const lotteryData = {
            id, ticket, fare, closingDate, creationDate, firstPrize, secondPrize,
            thirdPrize, open
        };
        res.status(200).json(lotteryData);
    } catch (err) {
        return res.status(401).json({
            message: "Error retrieving Lottery"
        });
    }
};

exports.editLottery = async (req, res) => {
    try {
        const { fare, closingDate, firstPrize, secondPrize, thirdPrize } = req.body;
        const result = await Lottery.updateOne({ _id: req.params.id },
            { fare: fare, closingDate: closingDate, firstPrize: firstPrize, secondPrize: secondPrize, thirdPrize: thirdPrize });
        if (result.n > 0) {
            res.status(200).json({ message: "Update successful!" });
        } else {
            res.status(401).json({ message: "Not authorized!" });
        }
    } catch (err) {
        res.status(500).json({
            message: "Couldn't udpate lottery"
        });
    }
};

exports.deleteLottery = async (req, res) => {
    try {
        const anyTicket = await Ticket.findOne({ lotteryId: req.params.id });

        if(!anyTicket){
            const result = await Lottery.deleteOne({ _id: req.params.id });
            if (result.n > 0) {
                res.status(200).json({ message: "Deleting lottery was successful!" });
            } else {
                res.status(500).json({ message: "Deleting lottery failed!" });
            }
        } else{
            res.status(500).json({ message: "Deleting lottery failed!" });
        }
    } catch {
        res.status(500).json({ message: "Deleting lottery failed!" });
    }
};