/**
 * App.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        name: {
            type: 'string',
            required: true
        },

        description: {
            type: 'string'
        },

        email: {
            type: 'email'
        },

        domain: {
            type: 'string',
            required: true
        },

        api: {
            type: 'string'
        },

        company: {
            type: 'string'
        },

        version: {
            type: 'float',
            defaultsTo: 0.1
        },

        logo: {
            type: 'string'
        },

        facebookAPI: {
            type: 'string'
        },

        linkedInAPI: {
            type: 'string'
        },

        twitterAPI: {
            type: 'string'
        },

        windowsAPI: {
            type: 'string'
        },

        googleAPI: {
            type: 'string'
        },

        facebookURL: {
            type: 'string'
        },

        linkedInURL: {
            type: 'string'
        },

        twitterURL: {
            type: 'string'
        },

        windowsURL: {
            type: 'string'
        },

        googleURL: {
            type: 'string'
        }

    }

};

