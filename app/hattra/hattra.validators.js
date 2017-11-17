'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {
  listHattra: {
    type: 'object',
    properties: Object.assign(
      {},
      commonSchemas.pagingAndSortingProperties,
      commonSchemas.searchingProperties
    )
  },

  updateNamaHattra: {
    type: 'object',
    properties: {
      nama: commonSchemas.varchar(25),
      ijin_hattra: commonSchemas.varchar(25)
    }
  },

  updateVerifikasiHattra: {
    type: 'object',
    properties: {
      verified: commonSchemas.varchar(25)
    }
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
