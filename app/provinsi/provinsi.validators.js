"use strict";

const _ = require("lodash");
const validation = require("../components/validation.js");
const commonSchemas = require("../common/schemas.js");

const schemas = {
  listProvinsi: {
    type: "object",
    properties: Object.assign(
      {},
      commonSchemas.pagingAndSortingProperties,
      commonSchemas.searchingProperties
    )
  },

  updateProvinsi: {
    type: "object",
    properties: {
      nama_provinsi: commonSchemas.varchar(),
      kepala_dinas: commonSchemas.varchar(),
      alamat: commonSchemas.text
    }
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
