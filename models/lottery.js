const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const lotterySchema = mongoose.Schema({
    fare: { type: Number, required: true },
    closingDate: { type: Date, required: true },
    firstPrize: { type: Number, required: true },
    secondPrize: { type: Number, required: true },
    thirdPrize: { type: Number, required: true },
    winningNumbers: [{ type: Number, required: false }],
    firstPrizeWinners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }],
    secondPrizeWinners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }],
    thirdPrizeWinners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }],
    creationDate: { type: Date, required: true },
    open: { type: Boolean, required: true }
});

lotterySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Lottery", lotterySchema, "lotteries");
