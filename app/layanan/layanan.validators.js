"use strict";

const _ = require("lodash");
const validation = require("../components/validation.js");
const commonSchemas = require("../common/schemas.js");

const schemas = {
  listLayanan: {
    type: "object",
    properties: Object.assign(
      {},
      commonSchemas.pagingAndSortingProperties,
      commonSchemas.searchingProperties
    )
  },

  updateNamaLayanan: {
    type: "object",
    properties: {
      nama_layanan: commonSchemas.varchar(255)
    }
  },

  updateVerifikasiLayanan: {
    type: "object",
    properties: {
      verified: commonSchemas.varchar(255)
    }
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
