const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const sportBetAdminSchema = mongoose.Schema({
    finalDate: { type: Date, required: true },
    matches: { type: [], required: true }
    
});

sportBetAdminSchema.plugin(uniqueValidator);

module.exports = mongoose.model("SportBetAdmin", sportBetAdminSchema, "sportBetsAdmin");