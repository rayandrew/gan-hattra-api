'use strict';

var knex = require('../components/knex.js');
const errors = require('http-errors');
const _ = require('lodash');

const hattraColumns = [
  'id_hattra',
  'id_layanan',
  'nama',
  'ijin_hattra',
  'verified',
  'created_at',
  'updated_at'
];
const hattraSearchableColumns = [
  'id_hattra',
  'id_layanan',
  'nama',
];

module.exports = {
  listHattra: (search, page, perPage, sort) => {
    return knex
      .select(
        hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
      )
      .from('hattra')
      .search(
        search,
        hattraSearchableColumns.map(column => 'hattra.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        hattraColumns.map(column => 'hattra.' + column)
      );
  },

  listHattraByKestrad: (search, page, perPage, sort, user) => {
    return knex
      .select(
        hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
      )
      .from('hattra')
      .where('username_puskesmas', user)
      .search(
        search,
        hattraSearchableColumns.map(column => 'hattra.' + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        hattraColumns.map(column => 'hattra.' + column)
      );
  },

  listHattraByKestrad: (search, page, perPage, sort, user) => {
    return knex
    .select(
      hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
    )
    .from('hattra')
    .innerJoin(
      'layanan',
      'hattra.id_layanan',
      'layanan.id_layanan'
    )
    .innerJoin(
      'user_kestrad',
      'layanan.username_kestrad',
      'user_kestrad.username_kestrad'
    )
    .where('username_kestrad', user)
    .search(
      search,
      hattraSearchableColumns.map(column => 'hattra.' + column)
    )
    .pageAndSort(
      page,
      perPage,
      sort,
      hattraColumns.map(column => 'hattra.' + column)
    );
  },

  listHattraByPuskesmas: (search, page, perPage, sort, user) => {
    return knex
    .select(
      hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
    )
    .from('hattra')
    .innerJoin(
      'layanan',
      'hattra.id_layanan',
      'layanan.id_layanan'
    )
    .innerJoin(
      'user_kestrad',
      'layanan.username_kestrad',
      'user_kestrad.username_kestrad'
    )
    .innerJoin(
      'user_puskesmas',
      'user_kestrad.username_puskesmas',
      'user_puskesmas.username_puskesmas'
    )
    .where('username_puskesmas', user)
    .search(
      search,
      hattraSearchableColumns.map(column => 'hattra.' + column)
    )
    .pageAndSort(
      page,
      perPage,
      sort,
      hattraColumns.map(column => 'hattra.' + column)
    );
  },

  listHattraByKota: (search, page, perPage, sort, user) => {
    return knex
    .select(
      hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
    )
    .from('hattra')
    .innerJoin(
      'layanan',
      'hattra.id_layanan',
      'layanan.id_layanan'
    )
    .innerJoin(
      'user_kestrad',
      'layanan.username_kestrad',
      'user_kestrad.username_kestrad'
    )
    .innerJoin(
      'user_puskesmas',
      'user_kestrad.username_puskesmas',
      'user_puskesmas.username_puskesmas'
    )
    .innerJoin(
      'user_kota',
      'user_puskesmas.username_kota',
      'user_kota.username_kota'
    )
    .where('username_kota', user)
    .search(
      search,
      hattraSearchableColumns.map(column => 'hattra.' + column)
    )
    .pageAndSort(
      page,
      perPage,
      sort,
      hattraColumns.map(column => 'hattra.' + column)
    );
  },

  listHattraByProvinsi: (search, page, perPage, sort, user) => {
    return knex
    .select(
      hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
    )
    .from('hattra')
    .innerJoin(
      'layanan',
      'hattra.id_layanan',
      'layanan.id_layanan'
    )
    .innerJoin(
      'user_kestrad',
      'layanan.username_kestrad',
      'user_kestrad.username_kestrad'
    )
    .innerJoin(
      'user_puskesmas',
      'user_kestrad.username_puskesmas',
      'user_puskesmas.username_puskesmas'
    )
    .innerJoin(
      'user_kota',
      'user_puskesmas.username_kota',
      'user_kota.username_kota'
    )
    .innerJoin(
      'user_provinsi',
      'user_kota.username_provinsi',
      'user_provinsi.username_provinsi'
    )
    .where('username_provinsi', user)
    .search(
      search,
      hattraSearchableColumns.map(column => 'hattra.' + column)
    )
    .pageAndSort(
      page,
      perPage,
      sort,
      hattraColumns.map(column => 'hattra.' + column)
    );
  },

  searchHattra: search => {
    return knex
      .select(
        hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
      )
      .from('hattra')
      .search(
        search,
        hattraSearchableColumns.map(column => 'hattra.' + column)
      )
      .limit(20);
  },
  
  searchHattraForKestrad: search => {
    return knex
      .select(
        hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
      )
      .from('hattra')
      .innerJoin(
        'layanan',
        'hattra.id_layanan',
        'layanan.id_layanan'
      )
      .innerJoin(
        'user_kestrad',
        'layanan.username_kestrad',
        'user_kestrad.username_kestrad'
      )
      .search(
        search,
        hattraSearchableColumns.map(column => 'hattra.' + column)
      )
      .limit(20);
  },

  searchHattraForPuskesmas: (search, username) => {
    return knex
      .select(
        hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
      )
      .from('hattra')
      .innerJoin(
        'layanan',
        'hattra.id_layanan',
        'layanan.id_layanan'
      )
      .innerJoin(
        'user_kestrad',
        'layanan.username_kestrad',
        'user_kestrad.username_kestrad'
      )
      .innerJoin(
        'user_puskesmas',
        'user_kestrad.username_puskesmas',
        'user_puskesmas.username_puskesmas'
      )
      .where('username_puskesmas', username)
      .search(
        search,
        hattraSearchableColumns.map(column => 'hattra.' + column)
      )
      .limit(20);
  },

  searchHattraForKota: (search, username) => {
    return knex
      .select(
        hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
      )
      .from('hattra')
      .innerJoin(
        'user_puskesmas',
        'hattra.username_puskesmas',
        'user_puskesmas.username'
      )
      .innerJoin(
        'layanan',
        'hattra.id_layanan',
        'layanan.id_layanan'
      )
      .innerJoin(
        'user_kestrad',
        'layanan.username_kestrad',
        'user_kestrad.username_kestrad'
      )
      .innerJoin(
        'user_puskesmas',
        'user_kestrad.username_puskesmas',
        'user_puskesmas.username_puskesmas'
      )
      .where('user_puskesmas.username_kota', username)
      .search(
        search,
        hattraSearchableColumns.map(column => 'hattra.' + column)
      )
      .limit(20);
  },

  searchHattraForProvinsi: (search, username) => {
    return knex
      .select(
        hattraColumns.map(column => 'hattra.' + column + ' as ' + column)
      )
      .from('hattra')
      .innerJoin(
        'layanan',
        'hattra.id_layanan',
        'layanan.id_layanan'
      )
      .innerJoin(
        'user_kestrad',
        'layanan.username_kestrad',
        'user_kestrad.username_kestrad'
      )
      .innerJoin(
        'user_puskesmas',
        'user_kestrad.username_puskesmas',
        'user_puskesmas.username_puskesmas'
      )
      .innerJoin(
        'user_kota',
        'user_puskesmas.username_kota',
        'user_kota.username_kota'
      )
      .where('user_kota.username_provinsi', username)
      .search(
        search,
        hattraSearchableColumns.map(column => 'hattra.' + column)
      )
      .limit(20);
  },

  updateHattra: (id, hattraUpdates) => {
    let promises = Promise.resolve();

    return promises.then(hattraUpdates => {
      return knex('hattra')
        .update(hattraUpdates)
        .where('id_hattra', id);
    });
  }
};
