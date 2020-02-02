const jwt = require('jsonwebtoken');
const jwt2 = require('jwt-simple');
const moment = require('moment');
const config = require('../config');


function verifyToken(req, res, next){
    const bearerHeader= req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token= bearerToken;

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if(err)  res.sendStatus(403);
        });

        next();

    }else {    res.sendStatus(403); }
}

function createToken(user){
    const  payload = {

        sub: user._identificacion,
        iat: moment().unix(),
        exp: moment().add(14,'days').unix(),
    }

    return jwt2.encode(payload, config.SECRET_TOKEN)

}

function decodeToken (token) {
    const decoded = new Promise((resolve, reject) => {
        try{
            const payload = jwt2.decode(token, config.SECRET_TOKEN)

            if (payload.exp <= moment().unix()) {
                reject({
                    status: 401,
                    message: 'El token ha expirado'
                })
            }
            resolve(payload.sub)
        }catch (err) {
            reject ({
                status: 500,
                message:'Token invalido'

            })
        }
    })

    return decoded
}

module.exports = {
    createToken,
    decodeToken
}