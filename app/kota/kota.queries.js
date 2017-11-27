'use strict';

var knex = require('../components/knex.js');
var helper = require('../common/helper.js');
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

const displayColumns = [
  'count_puskesmas',
  'count_kestrad',
  'count_layanan_verified',
  'count_layanan_not_verified',
  'count_hattra_verified',
  'count_hattra_not_verified'
];

const kotaUpdateableColumns = ['nama', 'kepala_dinas', 'alamat'];
const kotaSearchableColumns = [
  'username',
  'username_provinsi',
  'nama',
  'kepala_dinas',
  'alamat'
];

const kotaSortableColumns = [
  'username',
  'username_provinsi',
  'nama',
  'kepala_dinas',
  'alamat',
  'created_at',
  'updated_at'
];

module.exports = {
  listKota: (search, page, perPage, sort) => {
    return knex
      .select(
        kotaColumns
          .map(column => 'user_kota.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('user_kota')
      .innerJoin(
        'user_kota_additional',
        'user_kota.username',
        'user_kota_additional.username'
      )
      .search(
        search,
        kotaSearchableColumns.map(column => 'user_kota.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kotaSortableColumns.concat(displayColumns)
      );
  },

  searchUsers: (search, page, perPage, sort) => {
    return knex
      .select(
        kotaColumns
          .map(column => 'user_kota.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('user_kota')
      .innerJoin(
        'user_kota_additional',
        'user_kota.username',
        'user_kota_additional.username'
      )
      .search(
        search,
        kotaSearchableColumns.map(column => 'user_kota.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kotaSortableColumns.concat(displayColumns)
      );
  },

  getSpecificKota: username => {
    return knex
      .select(
        kotaColumns
          .map(column => 'user_kota.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('user_kota')
      .where('user_kota.username', username)
      .innerJoin(
        'user_kota_additional',
        'user_kota.username',
        'user_kota_additional.username'
      )
      .first();
  },

  getKotaForProvinsi: (search, page, perPage, sort, username) => {
    return knex
      .select(
        kotaColumns
        .map(column => 'user_kota.' + column + ' as ' + column)
        .concat(displayColumns)
      )
      .from('user_kota')
      .innerJoin(
        'user_kota_additional',
        'user_kota.username',
        'user_kota_additional.username'
      )
      .where('user_kota.username_provinsi', username)
      .search(
        search,
        kotaSearchableColumns.map(column => 'user_kota.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kotaSortableColumns.concat(displayColumns)
      );
  },

  listKotaByUsername: (
    search,
    page,
    perPage,
    sort,
    usernameLister,
    usernameRole,
    usernameListed
  ) => {
    let promises = Promise.resolve();
    promises = promises.then(() => {
      return helper.getRole(usernameListed).map(function (row) {
        return row.role;
      });
    });
    return promises.then(role => {
      if (role) {
        if (usernameRole === 'admin') {
          if (role[0] === 'provinsi') {
            return module.exports.getKotaForProvinsi(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          } else {
            return new errors.Forbidden();
          }
        }
      } else {
        return new errors.Forbidden();
      }
    });
  },

  updateKota: (username, kotaUpdates) => {
    kotaUpdates = _.pick(kotaUpdates, kotaUpdateableColumns);
    kotaUpdates.updated_at = new Date();
    return knex('user_kota')
      .update(kotaUpdates)
      .where('username', username);
  }
};
