const Ticket = require("../models/ticket");
const User = require("../models/user");
const Lottery = require("../models/lottery");
const GlobalBalance = require("../models/globalBalance");

exports.createLotteryTicket = async (req, res) => {
    try {
        const { lotteryId, userId, firstNumber, secondNumber, thirdNumber, fourthNumber, fifthNumber } = req.body;

        const user = await User.findOne({ _id: userId });
        const lottery = await Lottery.findOne({ _id: lotteryId });

        //Se verifica que el usuario tenga suficiente dinero
        if (user.balance < lottery.fare) {
            return res.status(401).json({
                message: "El usuario no tiene suficiente saldo para realizar esta lotería"
            });
        } else {
            // Verifica que la loteria este abierta
            if (lottery.open) {
                // Ajusta el balance del usuario
                const newUserBalance = user.balance - lottery.fare;
                const result1 = await User.updateOne({ _id: userId }, { balance: newUserBalance });
                if (result1 <= 0) {
                    return res.status(401).json({
                        message: "Ocurrió un error al restar el valor del saldo del usuario"
                    });
                }
                // Ajusta el balance global
                const globalBalance = await GlobalBalance.find();
                const newValue = globalBalance[0].value + lottery.fare;
                const result2 = await GlobalBalance.updateOne({ _id: globalBalance[0]._id }, { value: newValue });
                if (result2 <= 0) {
                    return res.status(401).json({
                        message: "Ocurrió un error al ajustar el balance global"
                    });
                }
                // Crea el tiquete
                const lotteryTicket = new Ticket({ userId, lotteryId, firstNumber, secondNumber, thirdNumber, fourthNumber, fifthNumber, creationDate: new Date() });
                const result = await lotteryTicket.save();
                res.status(201).json({
                    message: "Ticket de lotería creado satisfactoriamente",
                    result: result
                });
            } else {
                return res.status(401).json({
                    message: "No se puede participar en loterías ya cerradas"
                });
            }
        }
    } catch (err) {
        return res.status(500).json({
            message: err
        });
    }
};