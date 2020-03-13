const jwt = require("jsonwebtoken");
const SportTicket = require("../models/sportTicket");
const Match = require("../models/match");
const User = require("../models/user");
const GLobalBalance = require("../models/globalBalance");

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

exports.setSportWinners = async (req, res) => {
    try {
        const spTickets = await SportTicket.find();
        var today = new Date();
        //el dinero total de los premios
        var globalDebt = 0;

        spTickets.forEach(async (spTicket) => {
            //se verifica que el tiquete no se haya evaluado y que ya esté cerrado
            if(typeof spTicket.winner === "undefined" && today >= spTicket.closingDate){
                var areCorrect = 0;
                var won = false;
                
                //se cuentan los aciertos en el tiquete
                spTicket.matchBets.forEach(async (bet) => {
                    const match = await Match.findById(bet.match);
                    const userScore = bet.scoreBoard;

                    userScore === match.finalScoreBoard ? areCorrect++ : areCorrect;
                });
                //userProfit es el porcentaje de la ganancia
                var userProfit = 0;
                if (areCorrect >= 5){
                    won = true;
                    switch (areCorrect) {
                        case 5:
                          userProfit = 8;
                          break;
                        case 6:
                          userProfit = 8.5;
                          break;
                        case 7:
                          userProfit = 9;
                          break;
                        case 8:
                          userProfit = 12;
                          break;
                        case 9:
                          userProfit = 17;
                          break;
                        default:
                          userProfit = 25;
                      }
                    
                    //se Actualiza el balance del usuario sumandole el dinero ganado
                    const user = await User.findById(spTicket.user);
                    var newBalance = user.balance + (userProfit*spTicket.betValue); 
                    const results = await User.updateOne({ _id: spTicket.user}, { balance: newBalance});
                    //Se actualiza la deuda global
                    globalDebt = globalDebt + (userProfit*spTicket.betValue);
                }
                //se actualiza el tiquete: si ganó o no y el porcentaje que ganó
                const result = await SportTicket.updateOne({ _id: spTicket.id }, {isWinner: won, profit: userProfit});

                if (result.n <= 0) {
                    res.status(401).json({ message: "Error al actualizar tiquetes deportivos" });
                }
            }
        });
        //se le resta la deuda global al balance global
        const globalBalance = await GlobalBalance.find();
        const newValue = globalBalance[0].value - globalDebt;
        const editGlobalBalance = await GlobalBalance.updateOne({ _id: globalBalance[0]._id }, { value: newValue });

        if (editGlobalBalance.n > 0) {
            res.status(200).json({ message: 'Se determinaron los ganadores satisfactoriamente y se repartieron los respectivos premios' });
        } else {
            res.status(500).json({
                message: "Error al repartir los premios",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        });
    }
};