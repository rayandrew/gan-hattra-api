'use strict';

var knex = require('../components/knex.js');
const errors = require('http-errors');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const puskesmasColumns = [
  'username',
  'nama_kota',
  'nama',
  'kepala_dinas',
  'alamat',
  'created_at',
  'updated_at'
];
const puskesmasSearchableColumns = ['username', 'nama_dinas', 'kepala_dinas'];

module.exports = {
  listPuskesmas: (search, page, perPage, sort) => {
    return knex
      .select(
        puskesmasColumns.map(
          column => 'user_puskesmas.' + column + ' as ' + column
        )
      )
      .from('user_puskesmas')
      .search(
        search,
        puskesmasSearchableColumns.map(column => 'user_puskesmas.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        puskesmasColumns.map(column => 'user_puskesmas.' + column)
      );
  },

  searchPuskesmas: search => {
    return knex
      .select(['user_puskesmas', 'nama'])
      .from('user_puskesmas')
      .search(search, ['nama', 'user_puskesmas'])
      .limit(20);
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
      .select(puskesmasColumns)
      .from('user_puskesmas')
      .innerJoin(
        'user_kota',
        'user_puskesmas.username_kota',
        'user_kota.username'
      )
      .where('username_kota', username);
  },

  getPuskesmasForProvinsi: username => {
    return knex
      .select(puskesmasColumns)
      .from('user_puskesmas')
      .innerJoin(
        'user_kota',
        'user_puskesmas.username_kota',
        'user_kota.username'
      )
      .innerJoin(
        'user_provinsi',
        'user_kota.username_provinsi',
        'user_provinsi.username'
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
      return knex('user_puskesmas')
        .update(puskesmasUpdates)
        .where('username', username);
    });
  }
};
