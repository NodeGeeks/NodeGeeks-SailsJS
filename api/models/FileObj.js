/**
 * File.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        path: {
            type: 'string'
        },

        mime: {
            type: 'string'
        },

        size: {
            type: 'integer'
        }
    },

    beforeCreate: function(values, cb) {

    }
};

