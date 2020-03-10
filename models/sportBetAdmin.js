const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const sportBetAdminSchema = mongoose.Schema({
    adminId: { type: String, required: true },
    finalDate: { type: Date, required: true },
    matches: { type: [], required: true },
    open: { type: Boolean, required: true },
    adminCost: { type: Number, required: true },
    winners: { type: [], required: true }
});

sportBetAdminSchema.plugin(uniqueValidator);

module.exports = mongoose.model("SportBetAdmin", sportBetAdminSchema, "sportBetsAdmin");