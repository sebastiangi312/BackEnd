const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/user")

exports.createUser = async (req, res) => {

    try {
        const { id, name, email, password, birthdate, phone, balance, authorized, roles } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ id, name, email, password: hash, birthdate, phone, balance: 0, authorized: true, roles: { subscriber: true } });
        const result = await user.save();
        res.status(201).json({
            message: "Usuario creado satisfactoriamente",
            result: result
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error Interno del Servidor"
        });
    }
}

exports.userLogin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({
                message: "Credenciales de autenticación inválidas",
                });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                message: "Credenciales de autenticación inválidas"
            });
        }

        let payload = { email: user.email, userId: user._id }
        const token = jwt.sign(
            payload, process.env.JWT_KEY,
            { expiresIn: "1h" }
        );
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: user._id
        });
    } catch (err) {
        return res.status(401).json({
            message: "Credenciales de autenticación inválidas"
        });
    }
}

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(401).json({
                message: "Credenciales de autenticación inválidas"
            });
        }
        // teléfono, correo y contraseña
        const id = user.id;
        const name = user.name;
        const email = user.email;
        const birthdate = user.birthdate;
        const phone = user.phone;
        const balance = user.balance;
        const profileData = { id, name, email, birthdate, phone, balance }
        res.status(200).json(profileData);
    } catch (err) {
        return res.status(401).json({
            message: "Credenciales de autenticación inválidas"
        });
    }
}

exports.editUser = async (req, res) => {
    try {
        const { _id, email, phone, password, newPassword } = req.body
        const user = await User.findById(req.params.userId);
        if (newPassword === '') {
            const result = await User.updateOne({ _id: req.params.userId }, { email: email, phone: phone })
            if (result.n > 0) {
                res.status(200).json({ message: "Update successful!" });
            } else {
                res.status(401).json({ message: "Not authorized!" });
            }
        } else {
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                const hashedPassword = await bcrypt.hash(newPassword, 10)
                const result = await User.updateOne({ _id: req.params.userId }, { email: email, phone: phone, password: hashedPassword })
                if (result.n > 0) {
                    res.status(200).json({ message: "Update successful!" });
                } else {
                    res.status(401).json({ message: "Not authorized!" });
                }
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "Couldn't udpate post!"
        });
    }
}

exports.authorizeUser = async(req, res) => {
    try {
        //Usuario que se va a autorizar
        const {idUserToAuthorize} = req.body;

        const result = await User.updateOne({ _id: idUserToAuthorize }, {$set: {'roles.bettor': true}});
        
        if (result.n > 0) {
            res.status(200).json({ message: "Authorization successful!" });
        } else {
            res.status(401).json({ message: "Not authorized! ok", message: result });
        }

    } catch (err) {
        res.status(500).json({
            message: "Couldn't authorize user!"
        });
    }
}