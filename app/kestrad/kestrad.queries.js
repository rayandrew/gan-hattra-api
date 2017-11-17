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

};
