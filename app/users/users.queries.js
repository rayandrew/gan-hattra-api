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

module.exports = {
  listUsers: (search, page, perPage, sort) => {
    return knex.select(userColumns.map(column => 'users.' + column + ' as ' + column))
      .from('users')
      .search(search, userSearchableColumns.map(column => 'users.' + column))
      .pageAndSort(page, perPage, sort, userSortableColumns.map(column => 'users.' + column));
  },

  searchUsers: (search) => {
    return knex.select(['users.id as id', 'users.username as username', 'name', 'department', 'year'])
      .from('users')
      .leftJoin('students', 'users.nim', 'students.nim')
      .search(search, ['name', 'username'])
      .limit(20);
  },

  createUser: (newUser) => {
    let query = knex.select('username').from('users').where('username', newUser.username);

    newUser = _.pick(newUser, userAssignableColumns);
    newUser.created_at = newUser.updated_at = new Date();

    return query.first()
      .then((existingUsers) => {
        if (existingUsers) {
          if (existingUsers.username === newUser.username) {
            throw new errors.Conflict('Username already exists.');
          } else {
            throw new errors.Conflict('There is already a user for this NIM.');
          }
        }
        return bcrypt.hash(newUser.password, BCRYPT_STRENGTH);
      })
      .then((hash) => {
        newUser.password = hash;
        return knex('users').insert(newUser).then(insertedIds => Object.assign(newUser, { id: insertedIds[0], password: '' }));
      });
  },

  getUser: (username) => {
    return knex.select(userColumns)
      .from('users')
      .where('username', username)
      .first();
  },

  updateUser: (username, userUpdates, requireOldPasswordCheck = true, oldPassword = '') => {
    let promises = Promise.resolve();

    if (userUpdates.password) {
      if (requireOldPasswordCheck) {
        promises = promises.then(() => {
          return ensureOldPasswordIsCorrect(oldPassword);
        });
      }

      promises = promises.then(() => {
        return bcrypt.hash(userUpdates.password, BCRYPT_STRENGTH);
      });
    }

    userUpdates = _.pick(userUpdates, userAssignableColumns);
    userUpdates.updated_at = new Date();

    return promises
      .then((hash) => {
        userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
        return knex('users').update(userUpdates).where('username', username);
      });
  },

  deleteUser: (username) => {
    return knex('users').delete().where('username', username);
  }

};
