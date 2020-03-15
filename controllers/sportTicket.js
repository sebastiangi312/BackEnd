const jwt = require("jsonwebtoken");
const SportTicket = require("../models/sportTicket");
const Match = require("../models/match");
const User = require("../models/user");
const GlobalBalance = require("../models/globalBalance");


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
        }

        //Se verifica que el usuario tenga suficiente dinero y se le resta del balance
        const user = await User.findById(userId);
        if (user.balance < betValue) {
            return res.status(401).json({
                message: "El usuario no tiene suficiente saldo para realizar esta apuesta"
            });
        } else {
            const newUserBalance = user.balance - betValue;
            const result1 = await User.updateOne({ _id: userId }, { balance: newUserBalance });
            if (result1 <= 0) {
                return res.status(401).json({
                    message: "Ocurrió un error al restar el valor del saldo del usuario"
                });
            }
            const globalBalance = await GlobalBalance.find();
            const newValue = globalBalance[0].value + betValue;
            const result2 = await GlobalBalance.updateOne({ _id: globalBalance[0]._id }, { value: newValue });
            if (result2 <= 0) {
                return res.status(401).json({
                    message: "Ocurrió un error al ajustar el balance global"
                });
            }

            // Se crea la apuesta deportiva
            const sportTicket = new SportTicket({ userId, betValue, matchBets, closingDate, creationDate: new Date() });
            const result = await sportTicket.save();
            res.status(201).json({
                message: "Apuesta deportiva creada satisfactoriamente",
                result: result
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
exports.setSportEarnings = async (req, res) => {
    try {
        const spTickets = await SportTicket.find();
        spTickets.forEach(async (spTicket) => {
            //se verifica que el tiquete sea ganador y no se haya pagado
            if(spTicket.isWinner === true && !spTicket.paid === true){
                //userProfit es el porcentaje de la ganancia
                var userProfit = spTicket.profit;
                //validar si tiene dinero el bolsillo de administradores
                const globalBalance = await GlobalBalance.find();
                if (globalBalance >= 0){
                    //se Actualiza el balance del usuario sumandole el dinero ganado
                    const user = await User.findById(spTicket.userId);
                    var newBalance = user.balance + (userProfit*spTicket.betValue); 
                    const userBalance = await User.updateOne({ _id: spTicket.userId}, { balance: newBalance});
                    if (userBalance.n > 0) {
                        res.status(200).json({ message: 'Se repartieron los respectivos premios' });
                    } else {
                        res.status(500).json({
                            message: "Error al repartir los premios",
                        });
                    }
                    //se actualiza el bolsillo de dinero de los administradores
                    const globalBalance = await GlobalBalance.find();
                    const newValue = globalBalance[0].value - (userProfit*spTicket.betValue);
                    const editGlobalBalance = await GlobalBalance.updateOne({ _id: globalBalance[0]._id }, { value: newValue });
                    if (editGlobalBalance.n > 0) {
                        res.status(200).json({ message: 'Se desconto el dinero de los administradores' });
                    } else {
                        res.status(500).json({
                            message: "Error al descontar el dinero de los administradores",
                        });
                    }
                }
            
            }
        
        });
       
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        });
    }
}
