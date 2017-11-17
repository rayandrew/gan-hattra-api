'use strict';

var knex = require('../components/knex.js');
const errors = require('http-errors');
const _ = require('lodash');

const kestradColumns = [
  'username',
  'username_puskesmas',
  'nama',
  'penanggung_jawab',
  'alamat',
  'kecamatan',
  'created_at',
  'updated_at'
];

const displayColumns = [
  'username_provinsi',
  'username_kota',
  'count_layanan_verified',
  'count_layanan_not_verified',
  'count_hattra_verified',
  'count_hattra_not_verified'
];
const kestradSearchableColumns = ['username', 'username_puskesmas', 'nama'];

const kestradAssignableColumns = [
  'kecamatan',
  'nama',
  'kepala_dinas',
  'alamat'
];

const insertLayananColumns = [
  'id_subkategori',
  'username_kestrad',
  'nama_layanan',
  'verified'
];

const insertHattraColumns = [
  'id_layanan',
  'nama',
  'ijin_hattra',
  'verified'
];

module.exports = {
  listKestrad: (search, page, perPage, sort) => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column).concat(displayColumns)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_kestrad_additional',
        'user_kestrad.username',
        'user_kestrad_additional.username'
      )
      .search(
        search,
        kestradSearchableColumns.map(column => 'user_kestrad.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kestradColumns.map(column => 'user_kestrad.' + column)
      );
  },

  listKestradByPuskesmas: (search, page, perPage, sort, user) => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column).concat(displayColumns)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_kestrad_additional',
        'user_kestrad.username',
        'user_kestrad_additional.username'
      )
      .where('username_puskesmas', user)
      .search(
        search,
        kestradSearchableColumns.map(column => 'user_kestrad.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kestradColumns.map(column => 'user_kestrad.' + column)
      );
  },

  listKestradByKota: (search, page, perPage, sort, user) => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column).concat(displayColumns)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_kestrad_additional',
        'user_kestrad.username',
        'user_kestrad_additional.username'
      )
      .where('username_kota', user)
      .search(
        search,
        kestradSearchableColumns.map(column => 'user_kestrad.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kestradColumns.map(column => 'user_kestrad.' + column)
      );
  },

  listKestradByProvinsi: (search, page, perPage, sort, user) => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column).concat(displayColumns)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_kestrad_additional',
        'user_kestrad.username',
        'user_kestrad_additional.username'
      )
      .where('username_provinsi', user)
      .search(
        search,
        kestradSearchableColumns.map(column => 'user_kestrad.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kestradColumns.map(column => 'user_kestrad.' + column)
      );
  },

  searchKestrad: (search, page, perPage, sort) => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column).concat(displayColumns)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_kestrad_additional',
        'user_kestrad.username',
        'user_kestrad_additional.username'
      )
      .search(
        search,
        kestradSearchableColumns.map(column => 'user_kestrad.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kestradColumns.map(column => 'user_kestrad.' + column)
      );
  },

  getKestradByUsername: username => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column).concat(displayColumns)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_kestrad_additional',
        'user_kestrad.username',
        'user_kestrad_additional.username'
      )
      .where('username', username)
      .first();
  },

  updateKestrad: (username, kestradUpdates, username_puskesmas) => {
    let promises = Promise.resolve();
    promises = promises.then(() => {
      return knex
      .select()
      .from('user_kestrad')
      .where('username', username)
      .andWhere('username_puskesmas', username_puskesmas)
      .first()
    });
      
    return promises
      .then((kestrad) => {
        if(kestrad) {
          kestradUpdates = _.pick(kestradUpdates, kestradAssignableColumns);
          kestradUpdates.updated_at = new Date();
          return knex('user_kestrad')
          .update(kestradUpdates)
          .where('username', username);
        } else {
          return 0;
        }
      });
  },

  addLayanan: (username, insertLayanan) => {
    let query = knex
    .select('id_layanan')
    .from('layanan')
    .where({
      username_kestrad: username,
      nama_layanan: insertLayanan.nama_layanan
    });

    insertLayanan = _.pick(insertLayanan, insertLayananColumns);

    return query
      .first()
      .then(existinglayanan => {
        if (existinglayanan) {
          throw new errors.Conflict('Layanan already exists.');
        }
        return id_layanan;
      })
      .then(kestradInsert => {
            return knex('layanan')
              .insert(insertLayanan);
      });
  },

  addHattra: (username, insertHattra) => {
    let query = knex
    .select('id_hattra')
    .from('hattra')
    .where({
      id_hattra: insertHattra.id_hattra,
      nama: insertHattra.nama
    });

    insertHattra = _.pick(insertHattra, insertHattraColumns);

    return query
      .first()
      .then(existinglayanan => {
        if (existinglayanan) {
          throw new errors.Conflict('Hattra already exists.');
        }
        return id_layanan;
      })
      .then(kestradInsert => {
            return knex('hattra')
              .insert(insertHattra);
      });
  },

};
