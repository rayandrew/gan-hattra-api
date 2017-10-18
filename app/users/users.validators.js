'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {

  listUsers: {
    'type': 'object',
    'properties': Object.assign({}, commonSchemas.pagingAndSortingProperties, commonSchemas.searchingProperties)
  },

  createUser: {
    'type': 'object',
    'properties': {
      'username': commonSchemas.username,
      'nama': commonSchemas.varchar(25),
      'password': commonSchemas.password,
      'status': commonSchemas.userStatus,
      'role': commonSchemas.role,
      'email': commonSchemas.email
    },
    'anyOf': [
      {'required': ['username', 'password']},
      {'required': ['nama']}
    ]
  },

  updateUser: {
    'type': 'object',
    'properties': {
      'username': commonSchemas.username,
      'email': commonSchemas.email,
      'status': commonSchemas.userStatus,
      'role': commonSchemas.role,
      'oldPassword': commonSchemas.password,
      'newPassword': commonSchemas.password
    }
  }

};

module.exports = _.mapValues(schemas, validation.createValidator);
