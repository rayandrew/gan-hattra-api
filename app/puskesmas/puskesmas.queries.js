'use strict';

var knex = require('../components/knex.js');
const errors = require('http-errors');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const puskesmasColumns = [
  'username',
  'username_kota',
  'nama',
  'nama_dinas',
  'kepala_dinas',
  'alamat',
  'created_at',
  'updated_at'
];

const displayColumns = [
  'count_kestrad',
  'count_layanan_verified',
  'count_layanan_not_verified',
  'count_hattra_verified',
  'count_hattra_not_verified'
];

const puskesmasUpdateableColumns = ['nama', 'kepala_dinas', 'alamat'];
const puskesmasSearchableColumns = [
  'username',
  'username_kota',
  'nama',
  'kepala_dinas',
  'alamat'
];
const puskesmasSortableColumns = ['username', 'kepala_dinas', 'alamat'];

module.exports = {
  listPuskesmas: (search, page, perPage, sort) => {
    return knex
      .select(
        puskesmasColumns.map(
          column => 'user_puskesmas.' + column + ' as ' + column
          .concat(displayColumns)
        )
      )
      .from('user_puskesmas')
      .innerJoin(
        'user_puskesmas_additional',
        'user_puskesmas.username',
        'user_puskesmas_additional.username'
      )
      .search(
        search,
        puskesmasSearchableColumns.map(column => 'user_puskesmas.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        puskesmasSortableColumns.map(column => 'user_puskesmas.' + column)
      );
  },

  searchPuskesmas: search => {
    return knex
    .select(
      puskesmasColumns.map(
        column => 'user_puskesmas.' + column + ' as ' + column
        .concat(displayColumns)
      )
    )
    .from('user_puskesmas')
    .innerJoin(
      'user_puskesmas_additional',
      'user_puskesmas.username',
      'user_puskesmas_additional.username'
    )
    .search(
      search,
      puskesmasSearchableColumns.map(column => 'user_puskesmas.' + column)
    )
    .pageAndSort(
      page,
      perPage,
      sort,
      puskesmasSortableColumns.map(column => 'user_puskesmas.' + column)
    );
  },

  getSpecificPuskesmas: username => {
    return knex
      .select(puskesmasColumns)
      .from('user_puskesmas')
      .where('username', username)
      .first();
  },

  getPuskesmasForKota: username => {
    return knex
      .select(
        puskesmasColumns.map(
          column => 'user_puskesmas.' + column + ' as ' + column
          .concat(displayColumns)
        )
      )
      .from('user_puskesmas')
      .innerJoin(
        'user_puskesmas_additional',
        'user_puskesmas.username',
        'user_puskesmas_additional.username'
      )
      .where('username_kota', username);
  },

  getPuskesmasForProvinsi: username => {
    return knex
      .select(
        puskesmasColumns.map(
          column => 'user_puskesmas.' + column + ' as ' + column
          .concat(displayColumns)
        )
      )
      .from('user_puskesmas')
      .innerJoin(
        'user_puskesmas_additional',
        'user_puskesmas.username',
        'user_puskesmas_additional.username'
      )
      .where('username_provinsi', username);
  },

  getPuskesmas: username => {
    return knex
      .select(puskesmasColumns)
      .from('user_puskesmas')
      .where('username', username)
      .first();
  },

  updatePuskesmas: (username, puskesmasUpdates) => {
    let promises = Promise.resolve();

    return promises.then(puskesmasUpdates => {
      puskesmasUpdates = _.pick(puskesmasUpdates, puskesmasUpdateableColumns);
      puskesmasUpdates.updated_at = new Date();
      return knex('user_puskesmas')
        .update(puskesmasUpdates)
        .where('username', username);
    });
  },

  updatePuskesmasForKota: (username, puskesmasUpdates, username_kota) => {
    let promises = Promise.resolve();
    promises = promises.then(() => {
      return knex()
        .select('username')
        .from('user_puskesmas')
        .where('username', username)
        .andWhere('username_kota', username_kota)
        .first()
    });

    return promises.then((puskesmas) => {
      if(kota) {
        kotaUpdates = _.pick(puskesmasUpdates, puskesmasUpdateableColumns);
        kotaUpdates.updated_at = new Date();
        return knex('user_puskesmas')
          .update(puskesmasUpdates)
          .where('username', username);
      } else {
        return 0;
      }
    });
  }
};
