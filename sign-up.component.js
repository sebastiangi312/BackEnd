const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://mplay:<pPXdu96dxOQkc3rrE>@mplay-d7oek.mongodb.net/test?retryWrites=true&w=majority"), {useNewUrlParser: true};
const chai = require("chai");
const expect = chai.expect;

const nameSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    id: {type: Number, required: true},
    celular: {type: Number, required: true},
    correo: {type: String, required: true},
    password: {type: String, required: true},
    fechanacimiento: {type: Date, required: true},
    dineroDisponible: {type: Number, required: true},
    restriccion: {type: Boolean, required: true}
});

const usuarios = mongoose.model("usuarios", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/sign-up.component.html");
});

app.post("/", (req, res) => {
    var myData = new usuarios(req.body);
    myData.save()
        .then(item => {
            res.send("item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
