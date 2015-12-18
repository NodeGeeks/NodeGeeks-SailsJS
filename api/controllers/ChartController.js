/**
 * AppController
 *
 * @description :: Server-side logic for managing apps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = {

    /**
     *
     * @param req.body.model -- {string} name of the requested model
     * @param req.body.keys -- {array||string} the attribute of the model that are desired
     * @param req.body.sortBy - {string} the attribute used to sort the array
     * @param req.body.descending - {boolean} if the array should sort in ascending or descending order
     */

    gatherData: function(req, res) {
        var model = req.body.model.capitalizeFirstLetter();
        [model].native().exec(function(error, collection){
            if (error) return res.serverError(error);
            var criteria = {};
            req.body.keys.forEach(function(key){
                criteria[key] = true;
            });
            var sortObj = {};
            if (req.body.sortBy) {
                sortObj[req.body.sortBy] = req.body.descending ? -1 : 1;
            } else {
                sortObj.createdAt = req.body.descending ? -1 : 1;
            }
            collection.find({}, criteria).limit(req.body.limit || 25).sort(sortObj).toArray(function (err, results) {
                if (err) return res.serverError(err);

                return res.ok(results);
            });
        });
    }

};

