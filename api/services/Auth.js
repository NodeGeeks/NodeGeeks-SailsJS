/**
 * Created by aaronrussell on 10/29/15.
 */

var bcrypt = require('bcrypt'),
        emailRegex = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);

module.exports = {
    login: function (req, res) {

        if (emailRegex.test(req.body.login)) {
            Profile.findOne({email: req.body.login}).exec(execute);
        } else {
            Profile.findOne({username: req.body.login}).exec(execute);
        }
        function execute(err, profile) {
            if (err) return res.serverError(err);
            if (!profile) return res.notFound(err);

            bcrypt.compare(req.body.password, profile.password, function (err, match) {
                if (match) {
                    bcrypt.genSalt(10, function (err, salt) {
                        var preHashedToken = profile.password + new Date().getTime() + sails.config.session.secret;
                        bcrypt.hash(preHashedToken, salt, function (err, hash) {
                            profile.token = hash;
                            profile.save(function (error, response) {
                                req.session = profile;
                                sails.sockets.join(req.socket, response.id);
                                if (error) return res.serverError(error);
                                if (response) return res.ok(response);
                            });
                        });
                    });
                } else {
                    return res.forbidden();
                }
            });
        }
    },

    validate: function (req, res) {
        Profile.findOne({id: req.body.id}).exec(function (err, profile) {
            if (err) return res.serverError(err);
            if (!profile) return res.notFound(err);
            if (profile.token !== req.body.token) return res.forbidden();
            return res.json(profile);
        })
    },

    resetPassword: function (req, res) {
        Profile.findOne({id: req.body.id}).exec(function (err, profile) {

            if (err) return res.serverError(err);
            if (!profile) return res.notFound(err);
            if (req.body.hash == profile.resetPasswordHash) {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        profile.password = hash;
                        profile.save(function (error, response) {
                            delete response.password;
                            if (error) return res.serverError(error);
                            if (response) return res.ok(response);
                        });
                    })
                });
            } else {
                return res.forbidden();
            }
        });
    },

    recoverPassword: function (req, res) {

        Profile.findOne({email: req.body.email}).exec(function (err, profile) {
            if (err) return res.serverError(err);
            if (!profile) return res.notFound(err);
            bcrypt.genSalt(10, function (err, salt) {
                //TODO probably not secure to use their password to generate the reset password hash but it will work for now.
                bcrypt.hash(profile.password, salt, function (err, hash) {
                    profile.resetPasswordHash = hash;
                    profile.save(function (error, response) {
                        if (error) return res.serverError(error);
                        delete response.password;
                        var emailOptions = {
                            subject: 'Nautilus - Reset Password',
                            text: 'Please go to the following link to reset your password ' + global.APPUrl + '/#/resetPassword/' + response.id + '/' + response.resetPasswordHash,
                        };
                        Email.send(emailOptions.subject, emailOptions.text, response.email);
                        //todo: create callback or promise inside send method to determine if the email successfully sent out or not.
                        if (response) return res.ok();
                    });
                });
            });
        });
    },

    activate: function (req, res) {
        Profile.findOne({email: req.body.email}).exec(function (err, profile) {
            if (err) return res.json({error: err});

            if (profile.activateCode == req.body.activateCode) {
                profile.isActive = true;
                profile.save(function (error, response) {
                    if (error) return res.serverError(error);
                    if (response) return res.ok(response);
                })
            } else {
                return res.forbidden();
            }
        });
    }

};