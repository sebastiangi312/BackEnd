const jwt = require('jsonwebtoken');


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