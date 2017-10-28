'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {

    listPuskesmas: {
        'type': 'object',
        'properties': Object.assign({}, commonSchemas.pagingAndSortingProperties, commonSchemas.searchingProperties)
    },

    createPuskesmas: {
        'type': 'object',
        'properties': {
            'username': commonSchemas.username,
            'username_kota': commonSchemas.varchar(25),
            'nama': commonSchemas.varchar(25),
            'kepala_dinas': commonSchemas.varchar(),
            'alamat': commonSchemas.text
        },
        'anyOf': [
            { 'required': ['username'] }
        ]
    },

    updatePuskesmas: {
        'type': 'object',
        'properties': {
            'username': commonSchemas.username,
            'username_kota': commonSchemas.varchar(25),
            'nama': commonSchemas.varchar(25),
            'nama_dinas': commonSchemas.varchar(25),
            'kepala_dinas': commonSchemas.varchar(25),
            'alamat': commonSchemas.text
        }
    }

};

module.exports = _.mapValues(schemas, validation.createValidator);