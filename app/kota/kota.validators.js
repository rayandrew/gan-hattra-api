'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {
  listKota: {
    type: 'object',
    properties: Object.assign(
      {},
      commonSchemas.pagingAndSortingProperties,
      commonSchemas.searchingProperties
    )
  },

  updateKota: {
    type: 'object',
    properties: {
      nama: commonSchemas.varchar(25),
      kepala_dinas: commonSchemas.varchar(25),
      alamat: commonSchemas.text
    }
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
