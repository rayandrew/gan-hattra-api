'use strict';

var knex = require('../components/knex.js');
var helper = require('../common/helper.js');
const errors = require('http-errors');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const puskesmasColumns = [
  'username',
  'username_kota',
  'nama',
  'kepala_dinas',
  'alamat',
  'created_at',
  'updated_at'
];

const displayColumns = [
  'username_provinsi',
  'count_kestrad',
  'count_layanan_verified',
  'count_layanan_not_verified',
  'count_hattra_verified',
  'count_hattra_not_verified'
];

const puskesmasUpdateableColumns = ['nama', 'kepala_dinas', 'alamat'];
const puskesmasSearchableColumns = [
  'user_puskesmas.username',
  'user_puskesmas.username_kota',
  'username_provinsi',
  'nama',
  'kepala_dinas',
  'alamat'
];
const puskesmasSortableColumns = ['username', 'kepala_dinas', 'alamat'];

module.exports = {
  listPuskesmas: (search, page, perPage, sort) => {
    return knex
      .select(
        puskesmasColumns
          .map(column => 'user_puskesmas.' + column + ' as ' + column)
          .concat(displayColumns)
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
        puskesmasColumns.concat(displayColumns)
      );
  },

  searchPuskesmas: search => {
    return knex
      .select(
        puskesmasColumns.map(
          column =>
            'user_puskesmas.' + column + ' as ' + column.concat(displayColumns)
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
        puskesmasColumns.concat(displayColumns)
      );
  },

  getSpecificPuskesmas: username => {
    return knex
      .select(
        puskesmasColumns
          .map(column => 'user_puskesmas.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('user_puskesmas')
      .where('user_puskesmas.username', username)
      .innerJoin(
        'user_puskesmas_additional',
        'user_puskesmas.username',
        'user_puskesmas_additional.username'
      )
      .first();
  },

  getPuskesmasForKota: (search, page, perPage, sort, username) => {
    return knex
      .select(
        puskesmasColumns
          .map(column => 'user_puskesmas.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('user_puskesmas')
      .where('user_puskesmas.username_kota', username)
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
        puskesmasColumns.concat(displayColumns)
      );
  },

  getPuskesmasForProvinsi: (search, page, perPage, sort, username) => {
    return knex
      .select(
        puskesmasColumns
          .map(column => 'user_puskesmas.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('user_puskesmas')
      .where('username_provinsi', username)
      .innerJoin(
        'user_puskesmas_additional',
        'user_puskesmas.username',
        'user_puskesmas_additional.username'
      )
      .search(search, puskesmasSearchableColumns)
      .pageAndSort(
        page,
        perPage,
        sort,
        puskesmasColumns.concat(displayColumns)
      );
  },

  getPuskesmas: username => {
    return knex
      .select(puskesmasColumns)
      .from('user_puskesmas')
      .where('username', username)
      .first();
  },

  listPuskesmasByUsername: (
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
            return module.exports.getPuskesmasForProvinsi(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          } else if (role[0] === 'kota') {
            return module.exports.getPuskesmasForKota(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          } else {
            return new errors.Forbidden();
          }
        } else if (usernameRole === 'provinsi') {
          if (role[0] === 'admin' || role[0] === 'provinsi') {
            return new errors.Forbidden();
          } else {
            if (role[0] === 'kota') {
              let getUser = knex('user_kestrad_additional')
                .select('username_provinsi')
                .where('username_provinsi', usernameLister)
                .andWhere('username_kota', usernameListed);

              return getUser.first().then(provinsi => {
                if (provinsi) {
                  return module.exports.getPuskesmasForKota(
                    search,
                    page,
                    perPage,
                    sort,
                    usernameListed
                  );
                } else {
                  return new errors.Forbidden();
                }
              });
            }
          }
        }
      } else {
        return new errors.Forbidden();
      }
    });
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
  }
};
