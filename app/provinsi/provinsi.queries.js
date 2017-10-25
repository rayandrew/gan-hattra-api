'use strict';

var knex = require('../components/knex.js');
const errors = require('http-errors');
const _ = require('lodash');
const user = require('../users/users.queries.js');

const provinsiColumns = ['nama', 'nama_dinas', 'kepala_dinas', 'alamat'];
const provinsiUpdatableColumns = ['nama', 'nama_dinas', 'kepala_dinas', 'alamat'];
const provinsiSearchableColumns = ['username', 'nama','nama_dinas', 'kepala_dinas'];
//const userSortableColumns = ['username', 'email', 'role', 'status', 'created_at', 'updated_at'];

module.exports = {
  listProvinsi: (search, page, perPage, sort) => {
    return knex.select(provinsiColumns.map(column => 'user_provinsi.' + column + ' as ' + column))
      .from('user_provinsi')
      .search(search, provinsiSearchableColumns.map(column => 'user_provinsi.' + column))
      .pageAndSort(page, perPage, sort, provinsiColumns.map(column => 'user_provinsi.' + column));
  },

  searchProvinsi: (search, category) => {
    return knex.select(['username', 'nama'])
      .from('user_provinsi')
      .search(search, ['nama', 'username'])
      .limit(20);
  },

  createProvinsi: (newProvinsi) => {
    return user.createUser(newProvinsi);
  },

  getProvinsi: (username) => {
    return knex.select(provinsiColumns)
      .from('user_provinsi')
      .where('username', username)
      .first();
  },

  updateProvinsi: (username, userUpdates) => {
    let promises = Promise.resolve();
    userUpdates = _.pick(userUpdates, provinsiUpdatableColumns);
    userUpdates.updated_at = new Date();
    return knex('user_provinsi').update(userUpdates).where('username', username);
  }
};
