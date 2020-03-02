const jwt = require("jsonwebtoken");
const Transaction = require("../models/transaction");
const User = require("../models/user");

exports.createTransaction = async (req, res) => {
    try {
        const { amount, _idUser } = req.body;
        const transaction = new Transaction({ userID: _idUser, amount: amount, approved: false });
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

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json({
            message: "Transacciones encontradas satisfactoriamente",
            result: transactions
        });
    } catch {
        res.status(500).json({
            message: "Fallo encontrando las transacciones"
        });
    }
};

exports.getNonApprovedTransactions = async (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const TransactionQuery = Transaction.find({ approved: false });
    let fetchedTransactions;
    if (pageSize && currentPage) {
        userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    userQuery
    .then(documents => {
        fetchedTransactions = documents;
        return Transaction.count();
    })
    .then(count => {
        res.status(200).json({
            message: "Transactions fetched successfully!",
            transaction: fetchedTransactions,
            maxTransactions: count
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching transactions failed!"
        });
    });
};

exports.getSelectedTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.transactionId);
        const _iduser = transaction.userID;
        const _idadmin = transaction.adminID;
        const amount = transaction.amount;
        const approved = transaction.approved;
        const transactionData = { _iduser, _idadmin, amount, approved };
        res.status(200).json(transactionData);
    } catch (err) {
        return res.status(401).json({
            message: "Error retrieving Transaction"
        });
    }
};

exports.approveTransaction = async (req, res) => {
    try { 
        const { adminID, approved } = req.body;
        const result = await Transaction.updateOne({ _id: req.params.id }, { adminID: adminID, approved: approved });
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
