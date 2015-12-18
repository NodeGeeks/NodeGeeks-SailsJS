/**
 * AppController
 *
 * @description :: Server-side logic for managing apps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    login: function(req, res){

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
                            profile.save(function(error, response) {
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

    validate: function(req, res) {
        Profile.findOne({id: req.body.id}).exec(function(err, profile) {
            if (err) return res.serverError(err);
            if (!profile) return res.notFound(err);
            if (profile.token !== req.body.token) return res.forbidden();
            return res.json(profile);
        })
    }

};

