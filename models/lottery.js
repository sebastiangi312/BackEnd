const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    fare: { type: Number, required: true },
    closingDate: { type: Date, required: true },
    firstPrize: { type: Number, required: true },
    secondPrize: { type: Number, required: true },
    thirdPrize: { type: Number, required: true },
    creationDate: { type: Boolean, required: true },
    Open: { type: Boolean, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Lottery", userSchema, "lottery");
