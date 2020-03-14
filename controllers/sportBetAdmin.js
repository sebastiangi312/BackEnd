const jwt = require("jsonwebtoken");
const Sport = require("../models/sportBetAdmin");

exports.createSportBetAdmin = async (req, res) => {
    try {
        console.log(req.body);
        const { finalDate, matches } = req.body;
        const sportBetAdmin = new Sport({ finalDate, matches });
        const result = await sportBetAdmin.save();
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

        spTickets.forEach(async (spTicket) => {
            //se verifica que el tiquete no se haya evaluado y que ya esté cerrado
            if(typeof spTicket.isWinner === "undefined" && today >= spTicket.closingDate){
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
                    //profit es el porcentaje de la ganancia
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
            }
                //se actualiza el tiquete: si ganó o no y el porcentaje que ganó
                const result = await SportTicket.updateOne({ _id: spTicket.id }, {isWinner: won, profit: userProfit});

                if (result.n <= 0) {
                    res.status(401).json({ message: "Error al actualizar tiquetes deportivos" });
                }
            }
        
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
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
};