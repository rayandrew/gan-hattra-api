'use strict';

var knex = require('../components/knex.js');
var helper = require('../common/helper.js');
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

const insertHattraColumns = ['id_layanan', 'nama', 'ijin_hattra', 'verified'];

module.exports = {
  listKestrad: (search, page, perPage, sort) => {
    return knex
      .select(
        kestradColumns
          .map(column => 'user_kestrad.' + column + ' as ' + column)
          .concat(displayColumns)
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
        kestradColumns.concat(displayColumns)
      );
  },

  listKestradByPuskesmas: (search, page, perPage, sort, user) => {
    return knex
      .select(
        kestradColumns
          .map(column => 'user_kestrad.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_kestrad_additional',
        'user_kestrad.username',
        'user_kestrad_additional.username'
      )
      .where('user_kestrad.username_puskesmas', user)
      .search(
        search,
        kestradSearchableColumns.map(column => 'user_kestrad.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kestradColumns.concat(displayColumns)
      );
  },

  listKestradByKota: (search, page, perPage, sort, user) => {
    return knex
      .select(
        kestradColumns
          .map(column => 'user_kestrad.' + column + ' as ' + column)
          .concat(displayColumns)
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
        kestradColumns.concat(displayColumns)
      );
  },

  listKestradByProvinsi: (search, page, perPage, sort, user) => {
    return knex
      .select(
        kestradColumns
          .map(column => 'user_kestrad.' + column + ' as ' + column)
          .concat(displayColumns)
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
        kestradColumns.concat(displayColumns)
      );
  },

  listKestradByUsername: (
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
            return module.exports.listKestradByProvinsi(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          } else if (role[0] === 'kota') {
            return module.exports.listKestradByKota(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          } else if (role[0] === 'puskesmas') {
            return module.exports.listKestradByPuskesmas(
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
                  return module.exports.listKestradByKota(
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
            } else if (role[0] === 'puskesmas') {
              let getUser = knex('user_kestrad_additional')
                .select('username_provinsi')
                .where('username_provinsi', usernameLister)
                .andWhere('username_puskesmas', usernameListed);

              return getUser.first().then(provinsi => {
                if (provinsi) {
                  return module.exports.listKestradByPuskesmas(
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
        } else if (usernameRole === 'kota') {
          if (
            role[0] === 'admin' ||
            role[0] === 'provinsi' ||
            role[0] === 'kota'
          ) {
            return new errors.Forbidden();
          } else {
            if (role[0] === 'puskesmas') {
              let getUser = knex('user_kestrad_additional')
                .select('username')
                .where('username_kota', usernameLister)
                .andWhere('username_puskesmas', usernameListed);

              return getUser.first().then(kota => {
                if (kota) {
                  return module.exports.listKestradByPuskesmas(
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
            } else {
              return new errors.Forbidden();
            }
          }
        }
      } else {
        return new errors.Forbidden();
      }
    });
  },

  searchKestrad: (search, page, perPage, sort) => {
    return knex
      .select(
        kestradColumns
          .map(column => 'user_kestrad.' + column + ' as ' + column)
          .concat(displayColumns)
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
        kestradColumns.concat(displayColumns)
      );
  },

  getKestradByUsername: username => {
    return knex
      .select(
        kestradColumns
          .map(column => 'user_kestrad.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_kestrad_additional',
        'user_kestrad.username',
        'user_kestrad_additional.username'
      )
      .where('user_kestrad.username', username)
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
        .first();
    });

    return promises.then(kestrad => {
      if (kestrad) {
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

  addLayanan: insertLayanan => {
    let query = knex
      .select('id_layanan')
      .from('layanan')
      .where({
        username_kestrad: insertLayanan.username_kestrad,
        nama_layanan: insertLayanan.nama_layanan,
        id_subkategori: insertLayanan.id_subkategori
      });

    let newLayanan = _.pick(insertLayanan, insertLayananColumns);
    newLayanan.created_at = newLayanan.updated_at = new Date();
    
    return query
      .first()
      .then(existinglayanan => {
        if (existinglayanan) {
          throw new errors.Conflict('Layanan already exists.');
        }
      })
      .then(kestradInsert => {
        return knex('layanan').insert(newLayanan);
      });
  },

  addHattra: insertHattra => {
    let query = knex
      .select('id_hattra')
      .from('hattra')
      .where({
        id_layanan: insertHattra.id_layanan,
        nama: insertHattra.nama
      });

    let newHattra = _.pick(insertHattra, insertHattraColumns);
    newHattra.created_at = newHattra.updated_at = new Date();

    return query
      .first()
      .then(existinghattra => {
        if (existinghattra) {
          throw new errors.Conflict('Hattra already exists.');
        }
      })
      .then(kestradInsert => {
        return knex('hattra').insert(newHattra);
      });
  }
};
