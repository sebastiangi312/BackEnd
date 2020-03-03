require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const lotteryRoutes = require("./routes/lottery");
const adminRoutes = require("./routes/admin");
const transactionRoutes = require("./routes/transaction");
const ticketRoutes = require("./routes/ticket");

const matchRoutes = require("./routes/match");
const sportBetAdminRoutes = require("./routes/sportBetAdmin");

const app = express();

mongoose
    .connect(
        "mongodb+srv://mplay:" +
        process.env.MONGO_ATLAS_PW +
        "@mplay-d7oek.mongodb.net/test?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    )
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(err => {
        console.log("Connection failed!");
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use("/api/user", userRoutes);
app.use("/api/lottery", lotteryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/sportBetAdmin", sportBetAdminRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/lottery", adminRoutes);
app.use("/api/transaction", transactionRoutes);

module.exports = app;