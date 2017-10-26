'use strict';

var knex = require('../components/knex.js');
const errors = require('http-errors');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const user = require('../users/users.queries.js');

const BCRYPT_STRENGTH = 8;

const kestradColumns = ['username', 'nama_puskesmas', 'nama', 'nama_dinas', 'kepala_dinas', 'alamat', 'created_at', 'updated_at'];
const kestradSearchableColumns = ['username', 'nama_dinas', 'kepala_dinas'];

module.exports = {
    listKestrad: (search, page, perPage, sort) => {
        return knex.select(kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column))
            .from('user_kestrad')
            .search(search, kestradSearchableColumns.map(column => 'user_kestrad.' + column))
            .pageAndSort(page, perPage, sort, kestradColumns.map(column => 'user_kestrad.' + column));
    },

    searchKestrad: (search) => {
        return knex.select(['user_kestrad', 'nama'])
            .from('user_kestrad')
            .search(search, ['nama', 'user_kestrad'])
            .limit(20);
    },

    createKestrad: (newKestrad) => {
        return user.createUser(newKestrad);
    },

    getSpecificKestrad: (username) => {
        return knex.select(kestradColumns)
            .from('user_kestrad')
            .where('username', username)
            .first();
    },

    getKestradForPuskesmas: (username) => {
        return knex.select(kestradColumns)
            .from('user_kestrad')
            .innerJoin('user_puskesmas', 'user_kestrad.nama_puskesmas', 'user_puskesmas.username')
            .where('nama_kota', username)
    },

    getKestradsForKota: (username) => {
        return knex.select(puskesmasColumns)
            .from('user_kestrad')
            .innerJoin('user_puskesmas', 'user_kestrad.nama_puskesmas', 'user_puskesmas.username')
            .innerJoin('user_kota', 'user_puskesmas.nama_kota', 'user_kota.username')
            .where('nama_kota', username)
    },

    getKestradForProvinsi: (username) => {
        return knex.select(puskesmasColumns)
            .from('user_kestrad')
            .innerJoin('user_puskesmas', 'user_kestrad.nama_puskesmas', 'user_puskesmas.username')
            .innerJoin('user_kota', 'user_puskesmas.nama_kota', 'user_kota.username')
            .innerJoin('user_provinsi', 'user_kota.nama_provinsi', 'user_provinsi.username')
            .where('nama_provinsi', username);
    },

    getKestrad: (username) => {
        return knex.select(kestradColumns)
            .from('user_kestrad')
            .where('username', username)
            .first();
    },

    updateKestrad: (username, kestradUpdates) => {
        let promises = Promise.resolve();

        return promises
            .then((kestradUpdates) => {
                return knex('user_kestrad').update(kestradUpdates).where('username', username);
            });
    },

    deleteKestrad: (username) => {
        return knex('user_kestrad').delete().where('username', username);
    }
};