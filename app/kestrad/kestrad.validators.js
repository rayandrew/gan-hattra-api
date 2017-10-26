'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {

    listKestrad: {
        'type': 'object',
        'properties': Object.assign({}, commonSchemas.pagingAndSortingProperties, commonSchemas.searchingProperties)
    },

    createKestrad: {
        'type': 'object',
        'properties': {
            'username': commonSchemas.username,
            'nama_puskesmas': commonSchemas.varchar(),
            'nama': commonSchemas.varchar(),
            'kepala_dinas': commonSchemas.varchar(),
            'alamat': commonSchemas.text
        },
        'anyOf': [
            { 'required': ['username'] }
        ]
    },

    updateKestrad: {
        'type': 'object',
        'properties': {
            'username': commonSchemas.username,
            'nama_puskesmas': commonSchemas.varchar(),
            'nama': commonSchemas.varchar(),
            'kepala_dinas': commonSchemas.varchar(),
            'alamat': commonSchemas.text
        }
    }

};

module.exports = _.mapValues(schemas, validation.createValidator);