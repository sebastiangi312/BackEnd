const jwt = require("jsonwebtoken");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const GlobalBalance = require("../models/globalBalance");


exports.createTransaction = async (req, res) => {
    try {
        const { amount, _idUser, userName } = req.body;
        const transaction = new Transaction({ userID: _idUser, userName: userName, amount: amount, approved: false });
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
    const transactionQuery = Transaction.find({ approved: false });
    let fetchedTransactions;
    if (pageSize && currentPage) {
        transactionQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    transactionQuery
        .then(documents => {
            fetchedTransactions = documents;
            return Transaction.countDocuments();
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

exports.chargeMoney = async (req, res) => {
    try {
        //Usuario al que se la hara la recarga
        const chargeId = req.body.idChargeToAuthorize;
        const charge = await Transaction.findOne({ _id: chargeId });
        const userId = charge.userID;
        const amount = charge.amount;
        const user = await User.findOne({ _id: userId });
        const newBalance = amount + user.balance;
        const result = await User.updateOne({ _id: userId }, { balance: newBalance });
        const transactionUpdate = await Transaction.updateOne({ _id: chargeId }, { approved: true });
        const updateAdminGB = await GlobalBalance.updateOne({}, { $inc: { value: -amount } });
        // Se demora mucho porque hay muchos awaits.
        if (result.n > 0) {
            res.status(200).json({ message: "Recarga realizada correctamente" });
        } else {
            res.status(401).json({ message: "Error al realizar la recarga" });
        }

    } catch (err) {
        res.status(500).json({
            message: "Usuario no autorizado"
        });
    }
};

exports.deleteCharge = async (req, res) => {
    try {
        const chargeId = req.params.id;
        const result = await Transaction.remove({ _id: chargeId });
        if (result.n > 0) {
            res.status(200).json({ message: "Recarga eliminada correctamente" });
        } else {
            res.status(401).json({ message: "Error al eliminar la recarga" });
        }

    } catch (err) {
        res.status(500).json({
            message: "Usuario no autorizado"
        });
    }
};

exports.getTransactionUser = async (req, res) => {
    try {

        const transactionId = req.params.id;
        const result = await Transaction.findOne({ _id: transactionId });
        const user = await User.findOne({ _id: result.userID });
        if (!user) {
            return res.status(401).json({
                message: "Credenciales de autenticación inválidas"
            });
        }
        const name = user.name;
        const profileData = { name };
        res.status(200).json(profileData);

    } catch (err) {
        return res.status(401).json({
            message: "Credenciales de autenticacion invalidas"
        });
    }
};
