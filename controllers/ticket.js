const Ticket = require("../models/ticket");
const User = require("../models/user");
const Lottery = require("../models/lottery");

exports.createLotteryTicket = async (req, res) => {
    try {
        const { lotteryId, userId, firstNumber, secondNumber, thirdNumber, fourthNumber, fifthNumber } = req.body;

        const user = await User.findOne({ _id: userId });
        const lottery = await Lottery.findOne({ _id: lotteryId });

        //Se verifica que el usuario tenga suficiente dinero
        if (user.balance < lottery.fare && lottery.open) {
            return res.status(401).json({
                message: "El usuario no tiene suficiente saldo para realizar esta lotería"
            });
        }

        const newUserBalance = user.balance - lottery.fare;

        const result1 = await User.updateOne({ _id: userId }, { balance: newUserBalance });

        if (result1 <= 0) {
            return res.status(401).json({
                message: "Ocurrió un error al restar el valor del saldo del usuario"
            });
        }

        const lotteryTicket = new Ticket({ userId, lotteryId, firstNumber, secondNumber, thirdNumber, fourthNumber, fifthNumber, creationDate: new Date() });
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