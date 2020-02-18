const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true },
    user: { type: User, required: true },
    bet: { type: Lottery, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Ticket", userSchema, "ticket");
