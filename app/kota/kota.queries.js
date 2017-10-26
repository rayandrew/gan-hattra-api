'use strict';

var knex = require('../components/knex.js');
const errors = require('http-errors');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const BCRYPT_STRENGTH = 8;

function ensureOldPasswordIsCorrect (username, password) {
  return knex.first('username', 'password').from('users').where('username', username)
    .then(function (user) {
      if (!user) throw new errors.Unauthorized('Wrong username or password.');
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      if (!result) throw new errors.Unauthorized('Wrong username or password.');
      return Promise.resolve();
    });
}

const kotaColumns = ['username', 'nama_provinsi', 'nama', 'nama_dinas', 'kepala_dinas', 'alamat', 'created_at', 'updated_at'];
const kotaUpdateableColumns = ['nama', 'nama_dinas', 'kepala_dinas', 'alamat'];
const kotaSearchableColumns = ['nama_provinsi', 'nama', 'nama_dinas', 'kepala_dinas', 'alamat'];
const kotaSortableColumns = ['username', 'nama_dinas', 'kepala_dinas', 'alamat'];

module.exports = {
  listKota: (search, page, perPage, sort) => {
    return knex.select(kotaColumns.map(column => 'user_kota.' + column + ' as ' + column))
      .from('user_kota')
      .search(search, kotaSearchableColumns.map(column => 'user_kota.' + column))
      .pageAndSort(page, perPage, sort, kotaSortableColumns.map(column => 'user_kota.' + column));
  },

  getSpecificKota: (username) => {
    return knex.select(kotaColumns)
      .from('user_kota')
      .where('username', username)
      .first();
  }, 

  getKotaForProvinsi: (username) => {
    return knex.select(kotaColumns)
      .from('user_kota')
      .where('nama_provinsi', username)
  },

  updateKota: (username, kotaUpdates) => {
    let promises = Promise.resolve();
    kotaUpdates = _.pick(kotaUpdates, kotaUpdateableColumns);
    kotaUpdates.updated_at = new Date();

    return knex('user_kota').update(kotaUpdates).where('username', username);
  }
};
