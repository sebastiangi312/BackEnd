const SportTicket = require("../models/sportTicket");
const User = require("../models/user");
const SportBetAdmin = require("../models/sportBetAdmin");

exports.createSportTicket = async (req, res) => {
    try {
        const { userId, sportBetAdminID, userBoard} = req.body;

        const user = await User.findOne({ _id: userId });
        const sportBet = await SportBetAdmin.findOne({ _id: sportBetAdminID });

        //Se verifica que el usuario tenga suficiente dinero
        if (user.balance < sportBet.fare && sportBet.open) {
            return res.status(401).json({
                message: "El usuario no tiene suficiente saldo para realizar esta lotería"
            });
        }

        const newUserBalance = user.balance - sportBet.fare;
        const result1 = await User.updateOne({ _id: userId }, { balance: newUserBalance });

        if (result1 < 0) {
            return res.status(401).json({
                message: "Ocurrió un error al restar el valor del saldo del usuario"
            });
        }

        const spTicket = new SportTicket({ userId, sportBetAdminID, userBoard, wins: 0 });
        const result = await spTicket.save();
        res.status(201).json({
            message: "Ticket de apuesta deportiva creado satisfactoriamente",
            result: result
        });

    } catch (err) {
        return res.status(500).json({
            message: err
        });
    }
};