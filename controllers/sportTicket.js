const jwt = require("jsonwebtoken");
const SportTicket = require("../models/sportTicket");
const Match = require("../models/match");
const User = require("../models/user");


exports.createSportTicket = async (req, res) => {
    try {
        const { userId, betValue, matchBets } = req.body;

        // Se verifica que apueste para al menos 5 partidos
        if(matchBets.length < 5){
            return res.status(406).json({
                message: "Es necesario registrar al menos 5 apuestas"
            });
        }

        // Se encuentra la fecha del último partido
        var closingDate= null;

        for (const matchBet of matchBets) {
            var match = await Match.findById(matchBet.match);

            if(!closingDate || closingDate < match.matchDate){
                closingDate = match.matchDate;
            }
        };

        //Se verifica que el usuario tenga suficiente dinero y se le resta del balance
        const user = await User.findById(userId);


        if (user.balance < betValue) {
            return res.status(401).json({
                message: "El usuario no tiene suficiente saldo para realizar esta apuesta"
            });
        }

        const newUserBalance = user.balance - betValue;
        const result1 = await User.updateOne({ _id: userId }, { balance: newUserBalance });
        if (result1 <= 0) {
            return res.status(401).json({
                message: "Ocurrió un error al restar el valor del saldo del usuario"
            });
        }
        
        // Se crea la apuesta deportiva
        const sportTicket = new SportTicket({ user, betValue, matchBets, closingDate, creationDate: new Date() });
        const result = await sportTicket.save();
        res.status(201).json({
            message: "Apuesta deportiva creada satisfactoriamente",
            result: result
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
