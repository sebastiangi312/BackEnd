const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const lotterySchema = mongoose.Schema({
    fare: { type: Number, required: true },
    closingDate: { type: Date, required: true },
    firstPrize: { type: Number, required: true },
    secondPrize: { type: Number, required: true },
    thirdPrize: { type: Number, required: true },
    winningNumberOne: { type: Number, required: true },
    winningNumberTwo: { type: Number, required: true },
    winningNumberThree: { type: Number, required: true },
    winningNumberFour: { type: Number, required: true },
    winningNumberFive: { type: Number, required: true },
    firstPrizeWinners: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    secondPrizeWinners: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    thirdPrizeWinners: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    creationDate: { type: Date, required: true },
    open: { type: Boolean, required: true}
});

lotterySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Lottery", lotterySchema, "lotteries");
