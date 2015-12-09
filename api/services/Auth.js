/**
 * Created by aaronrussell on 10/29/15.
 */

var bcrypt = require('bcrypt'),
        emailRegex = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);

module.exports = {
    login: function(req, res){

        if (emailRegex.test(req.body.login)) {
            Profile.findOne({email: req.body.login}).exec(execute);
        } else {
            Profile.findOne({username: req.body.login}).exec(execute);
        }
        function execute(err, model) {
            if (err) return res.serverError(err);
            if (!model) return res.notFound(err);

            bcrypt.compare(req.body.password, model.password, function (err, match) {
                if (match) {
                    bcrypt.genSalt(10, function (err, salt) {
                        var preHashedToken = model.password + new Date().getTime() + sails.config.session.secret;
                        bcrypt.hash(preHashedToken, salt, function (err, hash) {
                            profile.token = hash;
                            profile.save(function(error, response) {
                                req.session = model;
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
    }
};