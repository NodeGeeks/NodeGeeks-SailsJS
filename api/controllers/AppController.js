/**
 * AppController
 *
 * @description :: Server-side logic for managing apps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    install: function(req, res) {
        App.count({}).exec(function(err, count) {
            if (count == 0) {
                App.create(req.body).exec(function(err, app){

                });
            }
        });
    }

};

