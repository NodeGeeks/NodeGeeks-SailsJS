/**
 * Issue.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        profile: {
            model: 'Profile'
        },

        description: {
            type: 'string'
        },

        status: {
            type: 'string',
            enum: ['closed', 'open', 'resolved']
        },

        messages: {
            collection: 'Message'
        }
    }
};

