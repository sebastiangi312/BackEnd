const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ticketSchema = mongoose.Schema({
    user: { type: User, required: true },
    bet: { type: Lottery, required: true},
    firstNumber: { type: Number, required: true },
    secondNumber: { type: Number, required: true },
    thirdNumber: { type: Number, required: true },
    fourthNumber: { type: Number, required: true },
    fifthNumber: { type: Number, required: true },
    creationDate: { type: Date, required: true }
});

ticketSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Ticket", ticketSchema, "tickets");
