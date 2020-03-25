const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Ticket = require("../models/ticket");
const SportTicket = require("../models/sportTicket");
const Match = require("../models/match");
const Lottery = require("../models/lottery");
const GlobalBalance = require("../models/globalBalance");

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
};

exports.userLogin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({
                message: "1. Credenciales de autenticación inválidas",
            });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                message: "2. Credenciales de autenticación inválidas"
            });
        }
        let payload = { email: user.email, userId: user._id };
        const token = jwt.sign(
            payload, process.env.JWT_KEY,
            { expiresIn: "1h" }
        );
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: user._id,
            id: user.id,
            name: user.name,
            email: user.email,
            birthdate: new Date(user.birthdate),
            phone: user.phone,
            balance: user.balance,
            roles: user.roles
        });
    } catch (err) {
        return res.status(401).json({
            message: "3. Credenciales de autenticación inválidas"
        });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const globalBalance = await GlobalBalance.find();
        const gb = globalBalance[0].value;
        if (!user) {
            return res.status(401).json({
                message: "4. Credenciales de autenticación inválidas"
            });
        }
        // teléfono, correo y contraseña
        const id = user.id;
        const name = user.name;
        const email = user.email;
        const birthdate = user.birthdate;
        const phone = user.phone;
        const roles = user.roles;
        if (roles.admin == true) {
            balance = gb;
        } else {
            balance = user.balance;
        }
        const profileData = { id, name, email, birthdate, phone, balance, roles };
        res.status(200).json(profileData);
    } catch (err) {
        return res.status(401).json({
            message: "5. Credenciales de autenticación inválidas"
        });
    }
};

exports.editUser = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { phone, password, newPassword } = req.body;
        const user = await User.findById(userId);
        if (newPassword === null || newPassword.trim() === '') {
            const result = await User.updateOne({ _id: userId }, { phone: phone });
            if (result.n > 0) {
                res.status(200).json({ message: "Update successful!" });
            } else {
                res.status(401).json({ message: "Not authorized!" });
            }
        } else {
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                const result = await User.updateOne({ _id: userId }, { phone: phone, password: hashedPassword });
                if (result.n > 0) {
                    res.status(200).json({ message: "Update successful!" });
                } else {
                    res.status(401).json({ message: "Not authorized!" });
                }
            }
        }
    } catch (err) {
        res.status(500).json({
            message: "Couldn't udpate user!"
        });
    }
};

exports.authorizeUser = async (req, res) => {
    try {
        //Usuario que se va a autorizar
        const { idUserToAuthorize, newBalance } = req.body;

        const result = await User.updateOne({ _id: idUserToAuthorize }, { $set: { roles: { bettor: true }, balance: newBalance } });

        if (result.n > 0) {
            res.status(200).json({ message: "Authorization successful!" });
        } else {
            res.status(401).json({ message1: "Not authorized! ok", message2: result }); // peta test
        }

    } catch (err) {
        res.status(500).json({
            message: "Couldn't authorize user!"
        });
    }
};

exports.deauthorizeUser = async (req, res) => {
    try {
        //Usuario que se va a autorizar
        const { idUserToAuthorize } = req.body;

        const result = await User.updateOne({ _id: idUserToAuthorize }, { roles: { bettor: false } });

        if (result.n > 0) {
            res.status(200).json({ message: "Authorization successful!" });
        } else {
            res.status(401).json({ message1: "Not authorized! ok", message2: result }); // peta test
        }

    } catch (err) {
        res.status(500).json({
            message: "Couldn't authorize user!"
        });
    }
};

exports.getNonSubUsers = async (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const userQuery = User.find({ roles: { subscriber: true } });
    let fetchedUsers;
    if (pageSize && currentPage) {
        userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    userQuery
        .then(documents => {
            fetchedUsers = documents;
            return fetchedUsers.length;
        })
        .then(count => {
            res.status(200).json({
                message: "Users fetched successfully!",
                users: fetchedUsers,
                maxUsers: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching users failed!"
            });
        });
};

exports.getAuthorizedUsers = async (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const userQuery = User.find({ roles: { subscriber: true, bettor: true } });
    let fetchedUsers;
    if (pageSize && currentPage) {
        userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    userQuery
        .then(documents => {
            fetchedUsers = documents;
            return User.count();
        })
        .then(count => {
            res.status(200).json({
                message: "Users fetched successfully!",
                users: fetchedUsers,
                maxUsers: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching users failed!"
            });
        });
};


// START My Tickets

exports.getSportTickets = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const sportTickets = await SportTicket.find({ user: userId });
        res.status(200).json({
            message: 'Tickets deportivos traídos satisfactoriamente',
            tickets: sportTickets
        })
    } catch {
        res.status(500).json({
            message: 'Error trayendo los tickets deportivos'
        })
    }
};

exports.getLotteryTickets = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const tickets = await Ticket.find({ userId: userId });
        res.status(200).json({
            message: 'Tickets de lotería traídos satisfactoriamente',
            tickets: tickets
        })
    } catch {
        res.status(500).json({
            message: 'Error trayendo los tickets de lotería'
        })
    }
}

exports.getLotteries = async (req, res) => {
    try {
        const ids = req.query.ids;
        const lotteries = await Lottery.find().where('_id').in(ids).exec();
        res.status(200).json({
            message: 'Loterías traídas satisfactoriamente',
            lotteries: lotteries
        })
    } catch {
        res.status(500).json({
            message: 'Error trayendo loterías'
        })
    }
};

exports.getMatches = async (req, res) => {
    try {
        const ids = req.query.ids;
        const matches = await Match.find().where('_id').in(ids).exec();
        res.status(200).json({
            message: 'Matches traídos satisfactoriamente',
            matches: matches
        })
    } catch {
        res.status(500).json({
            message: 'Error trayendo matches'
        })
    }
};

// END My Tickets