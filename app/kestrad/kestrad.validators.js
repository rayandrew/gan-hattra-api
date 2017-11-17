'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {
  listKestrad: {
    type: 'object',
    properties: Object.assign(
      {},
      commonSchemas.pagingAndSortingProperties,
      commonSchemas.searchingProperties
    )
  },

  listKategori: {
    type: 'object',
    properties: Object.assign(
      {},
      commonSchemas.pagingAndSortingProperties,
      commonSchemas.searchingProperties
    )
  },

  listSubkategori: {
    type: 'object',
    properties: Object.assign(
      {},
      commonSchemas.pagingAndSortingProperties,
      commonSchemas.searchingProperties
    )
  },

  listLayanan: {
    type: 'object',
    properties: Object.assign(
      {},
      commonSchemas.pagingAndSortingProperties,
      commonSchemas.searchingProperties
    )
  },

  createKestrad: {
    type: 'object',
    properties: {
      username: commonSchemas.username,
      username_puskesmas: commonSchemas.varchar(),
      nama: commonSchemas.varchar(),
      kepala_dinas: commonSchemas.varchar(),
      alamat: commonSchemas.text
    },
    anyOf: [{ required: ['username'] }]
  },

  createLayanan: {
    type: 'object',
    properties: {
      id_layanan: commonSchemas.auto_id,
      id_subkategori: commonSchemas.auto_id,
      nama_layanan: commonSchemas.varchar(),
      verified: commonSchemas.varchar(),
      tanggal_verified: commonSchemas.datetime
    },
    anyOf: [{ required: ['id_laynan', 'id_subkategori'] }]
  },

  updateKestrad: {
    type: 'object',
    properties: {
      nama: commonSchemas.varchar(),
      penanggung_jawab: commonSchemas.varchar(),
      alamat: commonSchemas.text,
      kecamatan: commonSchemas.varchar()
    }
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
