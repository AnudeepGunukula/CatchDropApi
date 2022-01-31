const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.users_signup_user = (req, res, next) => {
    User.find({ email: req.body.email }).then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'email already exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                else {
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });

                    user.save()
                        .then(result => {
                            res.status(201).json({
                                message: 'User Created'
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            })
                        })
                }
            });
        }
    })
        .catch(err => {
            error: err
        });

}


exports.users_login_user = (req, res, next) => {
    User.find({ email: req.body.email }).then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Authentication Failed'
            })
        }
        else {

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Authentication Failed'
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );

                    return res.status(200).json({
                        message: 'Authentication Successful',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Authentication Failed'
                })
            })
        }
    }).catch(err => {
        error: err
    })
}


exports.users_delete_user = (req, res, next) => {
    User.remove({ _id: req.params.userId }).then(result => {
        if (result.deletedCount >= 1) {
            res.status(200).json({
                message: 'User Deleted'
            })
        }
        else {
            res.status(404).json({
                message: "user not found"
            })
        }

    }).catch(err => {
        error: err
    });
}