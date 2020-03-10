const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const sportTicketSchema = mongoose.Schema({
    userId: { type: String, required: true },
    sportBetAdminID: { type: String, required: true},
    
    //Supongo que userBoard es una lista de este tipo:
    //[{matchID, score: "1-0", money}]
    userBoard: { type: [], required: true },
    wins: { type: Number, required: true }
});

sportTicketSchema.plugin(uniqueValidator);

module.exports = mongoose.model("SportTicket", sportTicketSchema, "SportTickets");
