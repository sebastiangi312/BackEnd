const jwt = require("jsonwebtoken");
const Ticket = require("../models/ticket");
const User = require("../models/user");
const Lottery= require("../models/lottery");

exports.createLotteryTicket = async (req, res) => {
    try {
        const { _idLottery, _idUser, firstNumber, secondNumber, thirdNumber, fourthNumber, fifthNumber} = req.body;
        const user = await User.findOne({ _id : _idUser });
        const lottery= await Lottery.findOne({ _id : _idLottery });
        const lotteryTicket = new Ticket({ user, lottery, firstNumber,secondNumber,thirdNumber,fourthNumber,fifthNumber, creationDate: new Date()});
        const result = await lotteryTicket.save();
        res.status(201).json({
            message: "Ticket de lotería creado satisfactoriamente",
            result: result
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};