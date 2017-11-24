'use strict';

/**
 * @module app/common/helper
 */

var knex = require('../components/knex.js');
const errors = require('http-errors');
const _ = require('lodash');

module.exports = {
    getRole: username => {
        return knex('users')
            .select('role')
            .where('username', username)
    }
};
