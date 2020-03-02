const Ticket = require("../models/ticket");

exports.createLotteryTicket = async (req, res) => {
    try {
        const { lotteryId, userId, firstNumber, secondNumber, thirdNumber, fourthNumber, fifthNumber} = req.body;
        const lotteryTicket = new Ticket({ userId, lotteryId, firstNumber,secondNumber,thirdNumber,fourthNumber,fifthNumber, creationDate: new Date()});
        const result = await lotteryTicket.save();
        res.status(201).json({
            message: "Ticket de lotería creado satisfactoriamente",
            result: result
        });
    } catch (err) {
        return res.status(500).json({
            message: err
        });
    }
};