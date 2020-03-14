const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Match = require("./match.js");

const sportBetSchema = mongoose.Schema({    
    userId: { type: String, required: true },
    betValue: { type: Number, required: true },
    matchBets: [{
        match: { type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true },
        scoreBoard:{ type: String, required: true }
    }],
    closingDate: { type: Date, required: true },
    creationDate: { type: Date, required: true }
});

sportBetSchema.plugin(uniqueValidator);

module.exports = mongoose.model("SportBet", sportBetSchema, "sportBets");