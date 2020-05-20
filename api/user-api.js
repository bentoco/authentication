const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('User')

const updateDataUser = (req, res, next) => {
    if (req.body.password !== req.body.passwordConf) {
        const err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("password dont match");
        return next(err);
    }
    
    if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {
            const userData = {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
            }

            User.create(userData, function (error, user) {
                if (error) {
                    return next(error);
                } else {
                    req.session.userId = user._id;
                    return res.redirect('/profile');
                }
            });
    } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error || !user) {
                const err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });

    }
    
}

const userAfterRegistred = (req, res, next) => {
    User.findById(req.session.userId)
        .exec((error, user) => {
            if(error) {
                return next(error);
            } else {
                if (user === null) {
                    const err = new Error('Not authorized! Go back');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.send('<h1> Name: </h1>' + user.username +
                    '<h2>Mail: </h2>' + user.email +
                    '<br><a type="button" href="/logout">Logout</a>')
                }
            }
        });
};

const userLogout = (res, req, next) => {
    delete req.session;
    (function (err){ 
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    }); 
};

module.exports = {
    updateDataUser,
    userAfterRegistred,
    userLogout
}