const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const transactionSchema = mongoose.Schema({
    user: { type: User, required: true },
    admin: { type: User, required: false },
    amount: { type: Number, required: true },
    approved: { type: Boolean, required: true }
});

transactionSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Transaction", userSchema, "transactions");
