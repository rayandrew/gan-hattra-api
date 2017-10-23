'use strict';

var knex = require('../components/knex.js');
const errors = require('http-errors');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const user = require('../users/users.queries.js');

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

const provinsiColumns = ['username', 'nama', 'nama_dinas', 'kepala_dinas', 'alamat', 'created_at', 'updated_at'];
//const provinsiAssignableColumns = ['nama', 'nama_dinas', 'kepala_dinas', 'alamat'];
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
    return knex.select(userColumns)
      .from('user_provinsi')
      .where('username', username)
      .first();
  },

  updateProvinsi: (username, userUpdates, requireOldPasswordCheck = true, oldPassword = '') => {
    let promises = Promise.resolve();

    return promises
      .then((userUpdates) => {
        return knex('user_provinsi').update(userUpdates).where('username', username);
      });
  },

  deleteProvinsi: (username) => {
    return knex('user_provinsi').delete().where('username', username);
  }

};
