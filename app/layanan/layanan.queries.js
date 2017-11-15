'use strict';

var knex = require('../components/knex.js');
const errors = require('http-errors');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const layananColumns = [
  'id_layanan',
  'id_subkategori',
  'username_kestrad',
  'nama_layanan',
  'verified',
  'tanggal_verified'
];
const displayColumns = [
  'username_provinsi',
  'username_kota',
  'username_puskesmas',
  'count_hattra_verified',
  'count_hattra_not_verified'
];

const layananSearchableColumns = [
  'nama_layanan', 
  'verified'
];

const layananAssignableColumns = [
  'nama_layanan', 
  'verified'
];

module.exports = {
  listLayanan: (search, page, perPage, sort) => {
    return knex
      .select(
        layananColumns.map(
          column => 'layanan.' + column + ' as ' + column
        ).concat(displayColumns)
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
        layananColumns.map(column => 'layanan.' + column)
      );
  },

  getLayananForProvinsi: (search, page, perPage, sort, username) => {
    return knex
      .select(
        layananColumns.map(
          column => 'layanan.' + column + ' as ' + column
        ).concat(displayColumns)
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
        layananColumns.map(column => 'layanan.' + column)
      )
  },

  getLayananForKota: (search, page, perPage, sort, username) => {
    return knex
      .select(
        layananColumns.map(
          column => 'layanan.' + column + ' as ' + column
        ).concat(displayColumns)
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
        layananColumns.map(column => 'layanan.' + column)
      )
  },

  getLayananForPuskesmas: (search, page, perPage, sort, username) => {
    return knex
      .select(
        layananColumns.map(
          column => 'layanan.' + column + ' as ' + column
        ).concat(displayColumns)
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
        layananColumns.map(column => 'layanan.' + column)
      )
  },

  getLayananForKestrad: (search, page, perPage, sort, username) => {
    return knex
      .select(
        layananColumns.map(
          column => 'layanan.' + column + ' as ' + column
        ).concat(displayColumns)
      )
      .from('layanan')
      .innerJoin(
        'layanan_additional',
        'layanan.id_layanan',
        'layanan_additional.id_layanan'
      )
      .where('username_kestrad', username)
      .search(
        search,
        layananSearchableColumns.map(column => 'layanan.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        layananColumns.map(column => 'layanan.' + column)
      )
  },

  searchLayanan: search => {
    return knex
      .select(displayColumns)
      .from('layanan')
      .innerJoin(
        'layanan_additional',
        'layanan.id_layanan',
        'layanan_additional.id_layanan'
      )
      .search(search, ['nama_layanan'])
      .limit(20);
  },

  getSpecificLayanan: nama => {
    return knex
      .select(displayColumns)
      .from('layanan')
      .innerJoin(
        'layanan_additional',
        'layanan.id_layanan',
        'layanan_additional.id_layanan'
      )
      .where('nama_layanan', nama)
      .first();
  },

  updateNamaLayanan: (id_layanan, layananUpdates) => {
    let promises = Promise.resolve();
    layananUpdates = _.pick(layananUpdates, layananAssignableColumns);
    return knex('layanan')
      .update(layananUpdates)
      .where('id_layanan', id_layanan);
  },
    
  updateVerifikasiLayanan: (id_layanan, layananUpdates) => {
    layananUpdates = _.pick(layananUpdates, layananAssignableColumns);
    if(layananUpdates.verified == "") {
      layananUpdates.tanggal_verified = new Date();
    }
    return knex('layanan')
    .update(layananUpdates)
    .where('id_layanan', id_layanan);
  }
};