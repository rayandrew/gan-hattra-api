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

const userColumns = ['username', 'email', 'password', 'role', 'status', 'created_at', 'updated_at'];
const userAssignableColumns = ['username', 'email', 'password', 'role', 'status'];
const userSearchableColumns = ['username', 'email'];
const userSortableColumns = ['username', 'email', 'role', 'status', 'created_at', 'updated_at'];
const specificUserColumns = ['username', 'nama_provinsi', 'nama_kota', 'nama_puskesmas', 'nama_dinas', 'kepala_dinas', 'alamat', 'created_at', 'updated_at'];

module.exports = {
  listUsers: (search, page, perPage, sort) => {
    return knex.select(userColumns.map(column => 'users.' + column + ' as ' + column))
      .from('users')
      .search(search, userSearchableColumns.map(column => 'users.' + column))
      .pageAndSort(page, perPage, sort, userSortableColumns.map(column => 'users.' + column));
  },

  searchUsers: (search, category) => {
    return knex.select(['username', 'nama'])
      .from('users')
      .leftJoin(category)
      .search(search, ['nama', 'username'])
      .limit(20);
  },

  createUser: (newUser, parent) => {
    let query = knex.select('username').from('users').where('username', newUser.username);

    newUser = _.pick(newUser, userAssignableColumns);
    newUser.created_at = newUser.updated_at = new Date();
    var specificUser = _.pick(newUser, specificUserColumns);
    specificUser.created_at = specificUser.updated_at = new Date();

    return query.first()
      .then((existingUsers) => {
        if (existingUsers) {
          throw new errors.Conflict('Username already exists.');
        }
        return bcrypt.hash(newUser.password, BCRYPT_STRENGTH);
      })
      .then((hash) => {
        newUser.password = hash;
        if(newUser.role !== 'admin' || newUser.role !== 'user') {
          if(newUser.role === 'provinsi') {
            return knex('users').insert(newUser).then(insertedIds => Object.assign(newUser, {password: ''}))
            .then(() => knex('user_provinsi').insert(specificUser))
          } else if(newUser.role === 'kota') {
            specificUser.nama_provinsi = knex.select('nama').from('user_provinsi').where('username', parent);
            return knex('users').insert(newUser).then(insertedIds => Object.assign(newUser, {password: ''}))
            .then(() => knex('user_kota').insert(specificUser));
          } else if(newUser.role === 'puskesmas') {
            specificUser.nama_kota = knex.select('nama').from('user_kota').where('username', parent);
            return knex('users').insert(newUser).then(insertedIds => Object.assign(newUser, {password: ''}))
            .then(() => knex('user_puskesmas').insert(specificUser));
          } else {
            specificUser.nama_puskesmas = knex.select('nama').from('user_puskesmas').where('username', parent);
            return knex('users').insert(newUser).then(insertedIds => Object.assign(newUser, {password: ''}))
            .then(() => knex('user_kestrad').insert(specificUser));
          }
        } else {
          return knex('users').insert(newUser).then(insertedIds => Object.assign(newUser, { password: '' }));
        }
      });
  },
  getUser: (username) => {
    return knex.select(userColumns)
      .from('users')
      .where('username', username)
      .first();
  },

  updateUser: (username, userUpdates) => {
    //const role = knex.select('role').from('users').where('username', username);
    let promises = Promise.resolve();
    if(userUpdates.password) {
      promises = promises.then(() => {
        return bcrypt.hash(userUpdates.password, BCRYPT_STRENGTH);
      });
    }
    userUpdates = _.pick(userUpdates, userAssignableColumns);
    userUpdates.updated_at = new Date();
    return knex.select('role').from('users').where('username', username)
    .then(result => {
      const { role } = result;
      if(role === 'admin') {
        return promises
          .then((hash) => {
            userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
            return knex('users').update(userUpdates).where('username', username);
          });
      } else {
        return promises
        .then((hash) => {
          userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
          return knex('users').update(userUpdates).where('username', username).then(() => {
            knex(role).update(userUpdates).where('username', username);
          });
        });
      }
    });
  },
  
  deleteUser: (username) => {
    return knex.select('role').from('users').where('username', username).first()
    .then(result => {
      const { role } = result;
      if(role === 'provinsi') {
        return knex('user_provinsi').delete().where('username', username);
      } else if(role === 'kota') {
        return knex('user_kota').delete().where('username', username);
      } else if(role === 'puskesmas') {
        return knex('user_puskesmas').delete().where('username', username);
      } else {
        return knex('user_kestrad').delete().where('username', username);
      }
    }).then(affectedRowCount => {
      return knex('users')
        .delete()
        .where('username', username)
        .then((affectedRow) => affectedRow + affectedRowCount);
    });
  }

};
