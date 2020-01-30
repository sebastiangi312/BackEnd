app.post('/editProfile', isLoggedIn, function(req, res, next){

    User.findById(req.user.id, function (err, user) {

        if (!user) {
            req.flash('error', 'No account found');
            return res.redirect('/edit');
        }

        var email = req.body.email.trim();
        var nombre = req.body.username.trim();

        if (!email || !nombre) { // simplified: '' is a falsey
            req.flash('error', 'One or more fields are empty');
            return res.redirect('/edit');
        }

        user.email = email;
        user.first_name = firstname;
        user.last_name = lastname;
        user.username = username;

        user.save(function (err) {

            res.redirect('/profile/');
        });
    });
});