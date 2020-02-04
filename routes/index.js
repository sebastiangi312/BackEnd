const auth = require('../middlewares/auth')

api.get('/private', auth, function(req,res){
    res.status(200).send({ message: 'Tienes acceso'})
})

module.exports = api