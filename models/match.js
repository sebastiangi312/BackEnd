const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const matchSchema = mongoose.Schema({
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    matchDate: { type: Date, required: true },
    scoreboard: { type: String, required: true },
    status: { type: Boolean, required: true }
});

matchSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Match", matchSchema, "matches");