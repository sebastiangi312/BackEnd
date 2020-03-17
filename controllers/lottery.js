const jwt = require("jsonwebtoken");
const Lottery = require("../models/lottery");
const Ticket = require("../models/ticket");
const User = require("../models/user");
const mongoose = require('mongoose');

exports.createLottery = async (req, res) => {
    try {
        const { fare, closingDate, firstPrize, secondPrize, thirdPrize } = req.body;
        const lottery = new Lottery({ fare, closingDate, firstPrize, secondPrize, thirdPrize, creationDate: new Date(), open: true });
        const result = await lottery.save();
        setTimeout(function () { console.log("Hello"); }, 10000);
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

exports.closeLottery = async (req, res) => {
    try {
        const lotteryId = req.body.id
        const lottery = await Lottery.findById(lotteryId);
        const firstPrizeWinners = [];
        const secondPrizeWinners = [];
        const thirdPrizeWinners = [];
        const winningNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 46));
        if (lottery.closingDate <= Date.now() && lottery.open) {
            const tickets = await Ticket.find({ lotteryId: lotteryId });
            tickets.forEach(ticket => {
                var count = 0;
                ticket.firstNumber === winningNumbers[0] ? count++ : count;
                ticket.secondNumber === winningNumbers[1] ? count++ : count;
                ticket.thirdNumber === winningNumbers[2] ? count++ : count;
                ticket.fourthNumber === winningNumbers[3] ? count++ : count;
                ticket.fifthNumber === winningNumbers[4] ? count++ : count;

                if (count === 5) {
                    firstPrizeWinners.push(ticket._id);
                } else if (count === 4) {
                    secondPrizeWinners.push(ticket._id);
                } else if (count === 3) {
                    thirdPrizeWinners.push(ticket._id);
                }
            });

            /**
             * Se puede mejorar
             * https://stackoverflow.com/questions/38742475/what-is-the-right-approach-to-update-many-records-in-mongodb-using-mongoose
             * 
             * O con esto (no lo he probado):
             * 
             * const userIds = firstPrizeWinners.map(ticketId => {
             *  let ticket = tickets.find(t => t._id === ticketId)
             *  return ticket.userId
             * });
             * 
             * User.updateMany( { _id: { "$in": userIds } }, { $inc: { balance: firstPrize } } )
             */
            firstPrizeWinners.forEach(async (ticketId) => {
                // find de array, no de mongo
                const ticket = tickets.find(ticket => ticket._id === ticketId);
                const userId = ticket.userId;
                const user = await User.findById(userId);
                const newBalance = user.balance + (lottery.firstPrize / firstPrizeWinners.length);
                const updateUser = await User.updateOne({ _id: userId }, { balance: newBalance });
            });

            secondPrizeWinners.forEach(async (ticketId) => {
                const ticket = tickets.find(ticket => ticket._id === ticketId);
                const userId = ticket.userId;
                const user = await User.findById(userId);
                var newBalance = user.balance + (lottery.secondPrize / secondPrizeWinners.length);
                const updateUser = await User.updateOne({ _id: userId }, { balance: newBalance });
            });

            thirdPrizeWinners.forEach(async (ticketId) => {
                const ticket = tickets.find(ticket => ticket._id === ticketId);
                const userId = ticket.userId;
                const user = await User.findById(userId);
                var newBalance = user.balance + (lottery.thirdPrize / thirdPrizeWinners.length);
                const updateUser = await User.updateOne({ _id: userId }, { balance: newBalance });
            });

            const firstPrizeWinnersOId = firstPrizeWinners.map(userId => mongoose.Types.ObjectId(userId));
            const secondPrizeWinnersOId = secondPrizeWinners.map(userId => mongoose.Types.ObjectId(userId));
            const thirdPrizeWinnersOId = thirdPrizeWinners.map(userId => mongoose.Types.ObjectId(userId));

            const updateLottery = await Lottery
                .updateOne({ _id: lotteryId },
                    {
                        open: false,
                        winningNumbers: winningNumbers,
                        firstPrizeWinners: firstPrizeWinnersOId,
                        secondPrizeWinners: secondPrizeWinnersOId,
                        thirdPrizeWinners: thirdPrizeWinnersOId
                    });
            if (updateLottery.n > 0) {
                res.status(200).json({ message: 'Se cerro satisfactoriamente' });
            } else {
                res.status(500).json({
                    message: "closing lottery failed! 1",
                });
            }
        } else {
            res.status(500).json({
                message: "closing lottery failed! 2"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
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

        if (!anyTicket) {
            const result = await Lottery.deleteOne({ _id: req.params.id });
            if (result.n > 0) {
                res.status(200).json({ message: "Deleting lottery was successful!" });
            } else {
                res.status(500).json({ message: "Deleting lottery failed!" });
            }
        } else {
            res.status(500).json({ message: "Deleting lottery failed!" });
        }
    } catch {
        res.status(500).json({ message: "Deleting lottery failed!" });
    }
};