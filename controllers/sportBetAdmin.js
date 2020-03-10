const jwt = require("jsonwebtoken");
const SportBet = require("../models/sportBetAdmin");
const SportTicket = require("../models/sportTicket");
const User = require("../models/user");
const Match = require("../models/match");

exports.createSportBetAdmin = async (req, res) => {
    try {
        console.log(req.body);
        const { finalDate, matches } = req.body;
        const sportBetAdmin = new SportBet({ finalDate, matches, open: true });
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
        const spBetID = req.body.id;
        const spTickets = await SportTicket.find({sportBetAdminID: spBetID});
        const winners = [];

        spTickets.forEach(async (spTicket) => {
            var correct = 0;
            var money = 0;
            const userBoards = spTicket.userBoard;
            userBoards.forEach(async (board) => {
                const match = await Match.findById(board[0]);
                const userScore = board[1];
                
                if (userScore === match.winningScore){
                    correct = correct + 1;
                    money = money + board[2];
                } 
            });

            if (correct >= 5){
                var profit = 1;
                if (wins === 5) {
                    profit = 8;
                } else if (correct === 6) {
                    profit = 8.5;
                } else if (correct === 7) {
                    profit = 9;
                } else if (correct === 8) {
                    profit = 12;
                } else if (correct === 9) {
                    profit = 17;
                } else {
                    profit = 25;
                }
                
                const user = await User.findById(spTicket.userId);
                var newBalance = user.balance + money*profit;
                const updateUser = await User.updateOne({ _id: spTicket.userId }, { balance: newBalance });
                //Tal vez haya que corregir esta actualización (spTicket._id?)
                //const updateSpTicket = await SportTicket.updateOne({ _id: spTicket._id }, { wins: correct });
                winners.push([spTicket.userId, correct, money*profit]);
                
                //Falta guardar la lista de ganadores
                //const winnersOId = winners.map(userId => mongoose.Types.ObjectId(userId));
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        });
    }
};