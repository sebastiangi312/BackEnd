const jwt = require("jsonwebtoken");
const Transaction = require("../models/transactions");

exports.createTransaction = async (req, res) => {
    try {
        const { amount, user } = req.body;
        const transaction = new Transaction({ user: user, amount: amount, approved: false });
        const result = await transaction.save();
        res.status(201).json({
            message: "Transaccion solicitada satisfactoriamente",
            result: result
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.getSelectedTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId);
        const user = transaction.user;
        const admin = transaction.admin;
        const amount = transaction.amount;
        const approved = transaction.approved;
        const transactionData = { user, admin, amount, approved };
        res.status(200).json(transactionData);
    } catch (err) {
        return res.status(401).json({
            message: "Error retrieving Transaction"
        });
    }
};

exports.approveTransaction = async (req, res) => {
    try { 
        const { admin, approved } = req.body;
        const result = await Transaction.updateOne({ _id: req.params.id }, { admin: admin, approved: approved });
        if (result.n > 0) {
            res.status(200).json({ message: "Approved!" });
        } else {
            res.status(401).json({ message: "Not authorized!" });
        }
    } catch (err) {
        res.status(500).json({
            message: "Couldn't approve the transaction"
        });
    }
};
