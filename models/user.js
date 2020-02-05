const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthdate: { type: Date, required: true },
    phone: String,
    balance: Number,
    authorized: { type: Boolean, required: true },
    roles: {
        subscriber: { type: Boolean, required: true },
        bettor: Boolean,
        editor: Boolean,
        admin: Boolean
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema, "users");
