/**
 * Notification.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        subject: {
            type: 'string'
        },

        type: {
            type: 'string'
        },

        content: {
            type: 'string'
        },

        isUnread: {
            type: 'boolean',
            defaultsTo: true
        },

        profile: {
            model: 'Profile'
        }

    }
};

