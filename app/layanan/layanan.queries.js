'use strict';

var knex = require('../components/knex.js');
var helper = require('../common/helper.js');
const errors = require('http-errors');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const kategoriColumns = ['id_kategori', 'nama_kategori'];

const kategoriSearchableColumns = ['nama_kategori'];

const subKategoriColumns = [
  'id_subkategori',
  'id_kategori',
  'nama_subkategori'
];

const subKategoriSearchableColumns = ['nama_kategori', 'nama_subkategori'];

const layananColumns = [
  'id_layanan',
  'id_subkategori',
  'username_kestrad',
  'nama_layanan',
  'verified',
  'tanggal_verified',
  'created_at',
  'updated_at'
];

const displayColumns = [
  'username_provinsi',
  'username_kota',
  'username_puskesmas',
  'count_hattra_verified',
  'count_hattra_not_verified'
];

const layananSearchableColumns = ['nama_layanan', 'verified'];

const layananAssignableColumns = ['nama_layanan', 'verified'];

module.exports = {
  listLayanan: (search, page, perPage, sort) => {
    return knex
      .select(
        layananColumns
          .map(column => 'layanan.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('layanan')
      .innerJoin(
        'layanan_additional',
        'layanan.id_layanan',
        'layanan_additional.id_layanan'
      )
      .search(
        search,
        layananSearchableColumns.map(column => 'layanan.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        layananColumns.concat(displayColumns)
      );
  },

  getLayananForProvinsi: (search, page, perPage, sort, username) => {
    return knex
      .select(
        layananColumns
          .map(column => 'layanan.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('layanan')
      .innerJoin(
        'layanan_additional',
        'layanan.id_layanan',
        'layanan_additional.id_layanan'
      )
      .where('username_provinsi', username)
      .search(
        search,
        layananSearchableColumns.map(column => 'layanan.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        layananColumns.concat(displayColumns)
      );
  },

  getLayananForKota: (search, page, perPage, sort, username) => {
    return knex
      .select(
        layananColumns
          .map(column => 'layanan.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('layanan')
      .innerJoin(
        'layanan_additional',
        'layanan.id_layanan',
        'layanan_additional.id_layanan'
      )
      .where('username_kota', username)
      .search(
        search,
        layananSearchableColumns.map(column => 'layanan.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        layananColumns.concat(displayColumns)
      );
  },

  getLayananForPuskesmas: (search, page, perPage, sort, username) => {
    return knex
      .select(
        layananColumns
          .map(column => 'layanan.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('layanan')
      .innerJoin(
        'layanan_additional',
        'layanan.id_layanan',
        'layanan_additional.id_layanan'
      )
      .where('username_puskesmas', username)
      .search(
        search,
        layananSearchableColumns.map(column => 'layanan.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        layananColumns.concat(displayColumns)
      );
  },

  getLayananForKestrad: (search, page, perPage, sort, username) => {
    return knex
      .select(
        layananColumns
          .map(column => 'layanan.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('layanan')
      .innerJoin(
        'layanan_additional',
        'layanan.id_layanan',
        'layanan_additional.id_layanan'
      )
      .where('layanan.username_kestrad', username)
      .search(
        search,
        layananSearchableColumns.map(column => 'layanan.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        layananColumns.concat(displayColumns)
      );
  },

  listLayananByUsername: (
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
            return module.exports.getLayananForProvinsi(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          } else if (role[0] === 'kota') {
            return module.exports.getLayananForKota(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          } else if (role[0] === 'puskesmas') {
            return module.exports.getLayananForPuskesmas(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          } else if (role[0] === 'kestrad') {
            return module.exports.getLayananForKestrad(
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
              let getUser = knex('layanan_additional')
                .select('username_provinsi')
                .where('username_provinsi', usernameLister)
                .andWhere('username_kota', usernameListed);

              return getUser.first().then(provinsi => {
                if (provinsi) {
                  return module.exports.getLayananForKota(
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
              let getUser = knex('layanan_additional')
                .select('username_provinsi')
                .where('username_provinsi', usernameLister)
                .andWhere('username_puskesmas', usernameListed);

              return getUser.first().then(provinsi => {
                if (provinsi) {
                  return module.exports.getLayananForPuskesmas(
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
            } else if (role[0] === 'kestrad') {
              let getUser = knex('layanan_additional')
                .select('username_provinsi')
                .where('username_provinsi', usernameLister)
                .andWhere('username_kestrad', usernameListed);

              return getUser.first().then(provinsi => {
                if (provinsi) {
                  return module.exports.getLayananForKestrad(
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
        } else if (usernameRole === 'kota') {
          if (
            role[0] === 'admin' ||
            role[0] === 'provinsi' ||
            role[0] === 'kota'
          ) {
            return new errors.Forbidden();
          } else {
            if (role[0] === 'puskesmas') {
              let getUser = knex('layanan_additional')
                .select('username_kota')
                .where('username_kota', usernameLister)
                .andWhere('username_puskesmas', usernameListed);

              return getUser.first().then(kota => {
                if (kota) {
                  return module.exports.getLayananForPuskesmas(
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
            } else if (role[0] === 'kestrad') {
              let getUser = knex('layanan_additional')
                .select('username_kota')
                .where('username_kota', usernameLister)
                .andWhere('username_kestrad', usernameListed);

              return getUser.first().then(kota => {
                if (kota) {
                  return module.exports.getLayananForKestrad(
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
        } else if (usernameRole === 'puskesmas') {
          if (role[0] !== 'kestrad') {
            return new errors.Forbidden();
          } else {
            if (role[0] === 'kestrad') {
              let getUser = knex('layanan_additional')
                .select('username_puskesmas')
                .where('username_puskesmas', usernameLister)
                .andWhere('username_kestrad', usernameListed);

              return getUser.first().then(puskesmas => {
                if (puskesmas) {
                  return module.exports.getLayananForKestrad(
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

  searchLayanan: (search, page, perPage, sort) => {
    return knex
      .select(
        layananColumns
          .map(column => 'layanan.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('layanan')
      .innerJoin(
        'layanan_additional',
        'layanan.id_layanan',
        'layanan_additional.id_layanan'
      )
      .search(
        search,
        layananSearchableColumns.map(column => 'layanan.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        layananColumns.concat(displayColumns)
      );
  },

  getSpecificLayanan: id => {
    return knex
      .select(
        layananColumns
          .map(column => 'layanan.' + column + ' as ' + column)
          .concat(displayColumns)
      )
      .from('layanan')
      .innerJoin(
        'layanan_additional',
        'layanan.id_layanan',
        'layanan_additional.id_layanan'
      )
      .where('layanan.id_layanan', id)
      .first();
  },

  listKategori: (search, page, perPage, sort) => {
    return knex
      .select(
        kategoriColumns.map(column => 'kategori.' + column + ' as ' + column)
      )
      .from('kategori')
      .search(
        search,
        kategoriSearchableColumns.map(column => 'kategori.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kategoriColumns
      );
  },

  listSubKategori: (search, page, perPage, sort) => {
    return knex
      .select(
        subKategoriColumns
          .map(column => 'subkategori.' + column + ' as ' + column)
          .concat(kategoriColumns.slice(1))
      )
      .from('subkategori')
      .innerJoin('kategori', 'kategori.id_kategori', 'subkategori.id_kategori');
  },

  updateNamaLayanan: (id_layanan, layananUpdates, username) => {
    let promises = Promise.resolve();
    promises = promises.then(() => {
      return knex()
        .select()
        .from('layanan')
        .innerJoin(
          'layanan_additional',
          'layanan.id_layanan',
          'layanan_additional.id_layanan'
        )
        .where('username_puskesmas', username)
        .andWhere('layanan.id_layanan', id_layanan)
        .first();
    });

    return promises.then(layanan => {
      if (layanan) {
        layananUpdates = _.pick(layananUpdates, layananAssignableColumns);
        return knex('layanan')
          .update(layananUpdates)
          .where('id_layanan', id_layanan);
      } else {
        return 0;
      }
    });
  },

  updateVerifikasiLayanan: (id_layanan, layananUpdates, username) => {
    let promises = Promise.resolve();
    promises = promises.then(() => {
      return knex
        .select()
        .from('layanan')
        .innerJoin(
          'layanan_additional',
          'layanan.id_layanan',
          'layanan_additional.id_layanan'
        )
        .where('username_kota', username)
        .andWhere('layanan.id_layanan', id_layanan)
        .first();
    });

    return promises.then(layanan => {
      if (layanan) {
        layananUpdates = _.pick(layananUpdates, layananAssignableColumns);
        if (layananUpdates.verified === 'active') {
          layananUpdates.tanggal_verified = new Date();
        } else {
          layananUpdates.tanggal_verified = null;
        }
        return knex('layanan')
          .update(layananUpdates)
          .where('id_layanan', id_layanan);
      } else {
        return 0;
      }
    });
  }
};
