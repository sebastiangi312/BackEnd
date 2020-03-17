const GlobalBalance = require("../models/globalBalance");

exports.getGlobalBalance = async (req, res) => {
    try {
        const globalBalance = await GlobalBalance.find();
        res.status(201).json({
            message: "Balance global fetched",
            result: globalBalance[0]
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

exports.editGlobalBalance = async (req, res) => {
    try {
        const globalBalance = await GlobalBalance.find();
        const newValue = globalBalance[0].value - req.body.value;
        const editGlobalBalance = await GlobalBalance.updateOne({ _id: globalBalance[0]._id }, { value: newValue });
        if (editGlobalBalance.n > 0) {
            res.status(201).json({
                message: "Balance global actualizado"
            });
        } else {
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};