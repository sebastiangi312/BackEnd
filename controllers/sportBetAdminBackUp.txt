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
