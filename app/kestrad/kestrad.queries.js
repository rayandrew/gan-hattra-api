'use strict';

var knex = require('../components/knex.js');
const errors = require('http-errors');
const _ = require('lodash');

const kestradColumns = ['username', 'username_puskesmas', 'nama', 'penanggung_jawab', 'jumlah_pegawai', 'alamat', 'kecamatan', 'verified', 'tanggal_verifikasi', 'created_at', 'updated_at'];
const kestradSearchableColumns = ['username', 'username_puskesmas', 'nama'];

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

    getSpecificKestrad: (username) => {
        return knex.select(kestradColumns)
            .from('user_kestrad')
            .where('username', username)
            .first();
    },

    getKestradForPuskesmas: (username) => {
        return knex.select(kestradColumns)
            .from('user_kestrad')
            .innerJoin('user_puskesmas', 'user_kestrad.username_puskesmas', 'user_puskesmas.username')
            .where('username_puskesmas', username)
    },

    getKestradsForKota: (username) => {
        return knex.select(kestradColumns)
            .from('user_kestrad')
            .innerJoin('user_puskesmas', 'user_kestrad.username_puskesmas', 'user_puskesmas.username')
            .innerJoin('user_kota', 'user_puskesmas.username_kota', 'user_kota.username')
            .where('username_kota', username)
    },

    getKestradForProvinsi: (username) => {
        return knex.select(kestradColumns)
            .from('user_kestrad')
            .innerJoin('user_puskesmas', 'user_kestrad.username_puskesmas', 'user_puskesmas.username')
            .innerJoin('user_kota', 'user_puskesmas.username_kota', 'user_kota.username')
            .innerJoin('user_provinsi', 'user_kota.username_provinsi', 'user_provinsi.username')
            .where('username_provinsi', username);
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
    }
};