'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {

  createSession: {
    'type': 'object',
    'properties': {
      'username': commonSchemas.username,
      'password': commonSchemas.varchar(255)
    },
    'required': ['username', 'password']
  }

};

module.exports = _.mapValues(schemas, validation.createValidator);
