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
const kestradSearchableColumns = ['username', 'username_puskesmas', 'nama'];
const layananColumns = [
  'id_layanan',
  'id_subkategori',
  'nama_layanan',
  'verified',
  'tanggal_verified'
];
const hattraColumns = [
  'id_hattra',
  'id_layanan',
  'nama_hattra',
  'ijin_hattra',
  'verifed',
  'tanggal_verified'
];

module.exports = {
  listKestrad: (search, page, perPage, sort) => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column)
      )
      .from('user_kestrad')
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
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column)
      )
      .from('user_kestrad')
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
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_puskesmas',
        'user_kestrad.username_puskesmas',
        'user_puskesmas.username'
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
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_puskesmas',
        'user_kestrad.username_puskesmas',
        'user_puskesmas.username'
      )
      .innerJoin(
        'user_kota',
        'user_puskesmas.username_kota',
        'user_kota.username'
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

  searchKestrad: search => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column)
      )
      .from('user_kestrad')
      .search(
        search,
        kestradSearchableColumns.map(column => 'user_kestrad.' + column)
      )
      .limit(20);
  },

  searchKestradForPuskesmas: (search, username) => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column)
      )
      .from('user_kestrad')
      .where('username_puskesmas', username)
      .search(
        search,
        kestradSearchableColumns.map(column => 'user_kestrad.' + column)
      )
      .limit(20);
  },

  searchKestradForKota: (search, username) => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_puskesmas',
        'user_kestrad.username_puskesmas',
        'user_puskesmas.username'
      )
      .where('user_puskesmas.username_kota', username)
      .search(
        search,
        kestradSearchableColumns.map(column => 'user_kestrad.' + column)
      )
      .limit(20);
  },

  searchKestradForProvinsi: (search, username) => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_puskesmas',
        'user_kestrad.username_puskesmas',
        'user_puskesmas.username'
      )
      .innerJoin(
        'user_kota',
        'user_puskesmas.username_kota',
        'user_kota.username'
      )
      .where('user_kota.username_provinsi', username)
      .search(
        search,
        kestradSearchableColumns.map(column => 'user_kestrad.' + column)
      )
      .limit(20);
  },

  getKestradByUsername: username => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column)
      )
      .from('user_kestrad')
      .where('username', username)
      .first();
  },

  getKestradForPuskesmas: username => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_puskesmas',
        'user_kestrad.username_puskesmas',
        'user_puskesmas.username'
      )
      .where('username_puskesmas', username);
  },

  getKestradForKota: username => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_puskesmas',
        'user_kestrad.username_puskesmas',
        'user_puskesmas.username'
      )
      .innerJoin(
        'user_kota',
        'user_puskesmas.username_kota',
        'user_kota.username'
      )
      .where('username_kota', username);
  },

  getKestradForProvinsi: username => {
    return knex
      .select(
        kestradColumns.map(column => 'user_kestrad.' + column + ' as ' + column)
      )
      .from('user_kestrad')
      .innerJoin(
        'user_puskesmas',
        'user_kestrad.username_puskesmas',
        'user_puskesmas.username'
      )
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

  updateKestrad: (username, kestradUpdates) => {
    let promises = Promise.resolve();

    return promises.then(kestradUpdates => {
      return knex('user_kestrad')
        .update(kestradUpdates)
        .where('username', username);
    });
  },

  getLayananKestrad: username => {
    return knex
      .select(
        layananColumns.map(column => 'layanan.' + column + ' as ' + column)
      )
      .from('layanan')
      .innerJoin(
        'subkategori',
        'layanan.id_subkategori',
        'subkategori.id_subkategori'
      )
      .innerJoin('kategori', 'kategori.id_kategori', 'subkategori.id_kategori')
      .where('username_kestrad', username);
  },

  getHattraLayanan: id => {
    return knex
      .select(hattraColumns.map(column => 'hattra.' + column + ' as ' + column))
      .from('hattra')
      .innerJoin('layanan', 'layanan.id_layanan', 'hattra.id_layanan')
      .where('hattra.id_layanan', id);
  },

  updateLayanan: (username, layananUpdate) => {
    let promises = Promise.resolve();

    idLayanan = knex
      .select('id_layanan')
      .from('layanan')
      .innerJoin(
        'subkategori',
        'layanan.id_subkategori',
        'subkategori.id_subkategori'
      )
      .innerJoin('kategori', 'subkategori.id_kategori', 'kategori.id_kategori')
      .where('username', username);

    return promises.then((idLayanan, layananUpdate) => {
      return knex('layanan')
        .update(layananUpdate)
        .where('id_layanan', idLayanan);
    });
  }
};
