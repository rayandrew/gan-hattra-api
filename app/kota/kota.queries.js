'use strict';

var knex = require('../components/knex.js');
const errors = require('http-errors');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const BCRYPT_STRENGTH = 8;

function ensureOldPasswordIsCorrect (username, password) {
  return knex
    .first('username', 'password')
    .from('users')
    .where('username', username)
    .then(function (user) {
      if (!user) throw new errors.Unauthorized('Wrong username or password.');
      return bcrypt.compare(password, user.password);
    })
    .then(result => {
      if (!result) throw new errors.Unauthorized('Wrong username or password.');
      return Promise.resolve();
    });
}

const kotaColumns = [
  'username',
  'username_provinsi',
  'nama',
  'kepala_dinas',
  'alamat',
  'created_at',
  'updated_at'
];
const kotaUpdateableColumns = ['nama', 'kepala_dinas', 'alamat'];
const kotaSearchableColumns = [
  'username',
  'username_provinsi',
  'nama',
  'kepala_dinas',
  'alamat'
];
const kotaSortableColumns = ['username', 'kepala_dinas', 'alamat'];

module.exports = {
  listKota: (search, page, perPage, sort) => {
    return knex
      .select(
        kotaColumns.map(column => 'user_kota.' + column + ' as ' + column)
      )
      .from('user_kota')
      .search(
        search,
        kotaSearchableColumns.map(column => 'user_kota.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kotaSortableColumns.map(column => 'user_kota.' + column)
      );
  },

  searchUsers: search => {
    return knex
      .select(kotaSearchableColumns)
      .from('user_kota')
      .search(search, ['username'])
      .limit(20);
  },

  getSpecificKota: username => {
    return knex
      .select(kotaColumns)
      .from('user_kota')
      .where('username', username)
      .first();
  },

  getKotaForProvinsi: (search, page, perPage, sort, username) => {
    return knex
      .select(
        kotaColumns.map(column => 'user_kota.' + column + ' as ' + column)
      )
      .from('user_kota')
      .where('user_kota.username_provinsi', username)
      .search(
        search,
        kotaSearchableColumns.map(column => 'user_kota.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kotaSortableColumns.map(column => 'user_kota.' + column)
      );
  },

  updateKota: (username, kotaUpdates) => {
    kotaUpdates = _.pick(kotaUpdates, kotaUpdateableColumns);
    kotaUpdates.updated_at = new Date();
    return knex('user_kota')
      .update(kotaUpdates)
      .where('username', username);
  },

  updateKotaForProvinsi: (username, kotaUpdates, username_provinsi) => {
    let promises = Promise.resolve();
    promises = promises.then(() => {
      return knex()
        .select('username')
        .from('user_kota')
        .where('username', username)
        .andWhere('username_provinsi', username_provinsi)
        .first()
    });

    return promises.then((kota) => {
      if(kota) {
        kotaUpdates = _.pick(kotaUpdates, kotaUpdateableColumns);
        kotaUpdates.updated_at = new Date();
        return knex('user_kota')
          .update(kotaUpdates)
          .where('username', username);
      } else {
        return 0;
      }
    });
  }
};
