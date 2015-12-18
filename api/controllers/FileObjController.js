/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    uploadFile: function (req, res) {
        req.file('file').upload({
            adapter: require('skipper-gridfs'),
            uri: 'mongodb://['+global.connections.mongoDbServer.user+':'+global.connections.mongoDbServer.password+'@]'+global.connections.mongoDbServer.host+'[:'+global.connections.mongoDbServer.port+'][/['+global.connections.mongoDbServer.data+'[.bucket]]'
        }, function (err, filesUploaded) {
            if (err) return res.negotiate(err);
            return res.ok();
        });
    }

};

