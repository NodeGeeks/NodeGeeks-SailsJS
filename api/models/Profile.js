/**
 * Profile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

module.exports = {

    attributes: {

        firstName: {
            type: 'string',
            required: true
        },

        lastName: {
            type: 'string',
            required: true
        },

        username: {
            type: 'string',
            unique: true
        },

        email: {
            type: 'email',
            unique: true
        },

        password: {
            type: 'string'
        },

        token: {
            type: 'string'
        },

        role: {
            type: 'string',
            enum: ['admin', 'moderator', 'billing', 'developer', 'member'],
            defaultsTo: 'member'
        },

        image: {
            type: 'string'
        },

        dob: {
            type: 'date'
        },

        activationCode: {
            type: 'string'
        },

        resetPasswordHash: {
            type: 'string'
        },

        isActive: {
            type: 'boolean',
            defaultsTo: false
        },

        notifications: {
            collection: 'Notification',
            via: 'profile'
        },

        socialProfiles: {
            collection: 'Social',
            via: 'profile'
        },

        isPrimarilySocialAccount: {
            type: 'boolean',
            defaultsTo: false
        },

        issues: {
            collection: 'Issue',
            via: 'profile'
        },

        conversations: {
            collection: 'Conversation',
            via: 'participants'
        }

    },

    beforeCreate: function(values, cb) {
        if (!values.isPrimarilySocialAccount) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(values.password, salt, function (err, hash) {
                    values.password = hash;
                    var preHashedActivateCode = new Date().toString() + values.email;
                    bcrypt.hash(preHashedActivateCode, salt, function (err, activateCode) {
                        var subject = global.app.name + ' Activation';
                        var bodyText = 'Please activate your account by going to the following link ' + global.app.domain + '/activate?email=' + values.email + '&activateToken=' + activateCode;
                        Email.send(subject, bodyText, values.email);
                        cb();
                    });
                })
            });
        }
    },

    toJSON: function() {
        var obj = this.toObject();
        delete obj.password;
        delete obj.token;
        delete obj.createdAt;
        delete obj.updatedAt;
        return obj;
    }
};

