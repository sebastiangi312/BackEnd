const mongoose = require("mongoose");

const globalBalanceSchema = mongoose.Schema({
    value: { type: Number, required: true}
});

module.exports = mongoose.model("GlobalBalance", globalBalanceSchema, "globalBalance");
