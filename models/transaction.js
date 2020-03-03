const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const transactionSchema = mongoose.Schema({
    userID: { type: String, required: true },
    userName: { type: String, required: true },
    adminID: { type: String, required: false },
    amount: { type: Number, required: true },
    approved: { type: Boolean, required: true }
});

transactionSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Transaction", transactionSchema, "transactions");
