'use strict';

var knex = require('../components/knex.js');
const errors = require('http-errors');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const BCRYPT_STRENGTH = 8;

function ensureOldPasswordIsCorrect (username, password) {
  return knex
    .first('username', 'password')
    .from('users')
    .where('username', username)
    .then(function (user) {
      if (!user) throw new errors.Unauthorized('Wrong username or password.');
      return bcrypt.compare(password, user.password);
    })
    .then(result => {
      if (!result) throw new errors.Unauthorized('Wrong username or password.');
      return Promise.resolve();
    });
}

const userColumns = [
  'users.username',
  'email',
  'password',
  'role',
  'status',
  'users.created_at',
  'users.updated_at'
];
const userAssignableColumns = [
  'username',
  'email',
  'password',
  'role',
  'status'
];
const userSearchableColumns = ['username', 'email'];
const userSortableColumns = [
  'username',
  'email',
  'role',
  'status',
  'created_at',
  'updated_at'
];
const specificUserColumns = [
  'username',
  'nama',
  'kepala_dinas',
  'alamat',
  'created_at',
  'updated_at'
];

const kotaAdditional = [
  'user_kota.username_provinsi'
];

const puskesmasAdditional = [
  'user_puskesmas_additional.username_provinsi',
  'user_puskesmas.username_provinsi'
];

const kestradAdditional = [
  'user_kestrad_additional.username_provinsi',
  'user_kestrad_additional.username_kota',
  'user_kestrad.username_puskesmas'
];

const countAdditional = [
  'count_kota',
  'count_puskesmas',
  'count_kestrad',
  'count_layanan_verified',
  'count_layanan_not_verified',
  'count_hattra_verified',
  'count_hattra_not_verified'
];

const middleTable = [
  'nama_dinas',
  'kepala_dinas',
  'nama',
  'alamat',
  'penanggung_jawab',
  'kecamatan'
];


const getProvinsiTable = userColumns.concat(middleTable.slice(0,4)).concat(countAdditional);

const getKotaTable = userColumns.concat(kotaAdditional).concat(middleTable.slice(0,4)).concat(countAdditional.slice(1,7));

const getPuskesmasTable = userColumns.concat(puskesmasAdditional).concat(middleTable.slice(0,4)).concat(countAdditional.slice(2,7));

const getKestradTable = userColumns.concat(kestradAdditional).concat(middleTable.slice(2,6)).concat(countAdditional.slice(3,7));


module.exports = {
  listUsers: (search, page, perPage, sort) => {
    return knex
      .select(userColumns.map(column => 'users.' + column + ' as ' + column))
      .from('users')
      .search(search, userSearchableColumns.map(column => 'users.' + column))
      .pageAndSort(
        page,
        perPage,
        sort,
        userSortableColumns.map(column => 'users.' + column)
      );
  },

  searchUsers: search => {
    return knex
      .select(['username'])
      .from('users')
      .search(search, ['username'])
      .limit(20);
  },

  createUser: (user, parent) => {
    let query = knex
      .select('username')
      .from('users')
      .where('username', user.username);

    let newUser = _.pick(user, userAssignableColumns);
    newUser.created_at = newUser.updated_at = new Date();
    let specificUser = _.pick(user, specificUserColumns);
    specificUser.created_at = specificUser.updated_at = new Date();

    return query
      .first()
      .then(existingUsers => {
        if (existingUsers) {
          throw new errors.Conflict('Username already exists.');
        }
        return bcrypt.hash(newUser.password, BCRYPT_STRENGTH);
      })
      .then(hash => {
        newUser.password = hash;
        if (newUser.role !== 'admin' && newUser.role !== 'user') {
          let queries = knex('users')
          .insert(newUser)
          .then(insertedIds => Object.assign(newUser, { password: '' }))
          
          if (newUser.role === 'provinsi') {
              return queries
              .then((userAdded) => {
                return knex('user_provinsi').insert(specificUser)
              })
              .then(insertedMiddle => {
                return specificUser;
              });
          } else if (newUser.role === 'kota') {
            specificUser.username_provinsi = parent;
            return queries
            .then((userAdded) => {
              return knex('user_kota').insert(specificUser)
            })
            .then(insertedMiddle => {
              return specificUser;
            });
          } else if (newUser.role === 'puskesmas') {
            specificUser.username_kota = parent;
            return queries
            .then((userAdded) => {
              return knex('user_puskesmas').insert(specificUser)
            })
            .then(insertedMiddle => {
              return specificUser;
            });
          } else {
            specificUser.username_puskesmas = parent;
            return queries
            .then((userAdded) => {
              return knex('user_kestrad').insert(specificUser)
            })
            .then(insertedMiddle => {
              return specificUser;
            });
          }
          //return queries;
        } else {
          return queries;
        }
      });
  },

  getUser: username => {
    let promises = Promise.resolve();
    promises = promises.then(() => {
      return knex()
        .select('role')
        .from('users')
        .where('username', username)
        .map(function(row) {
          return row.role;
        });
    });
    
    return promises
      .then((role) => {
        if(role == 'provinsi') {
          return knex
            .select(getProvinsiTable)
            .from('users')
            .innerJoin(
              'user_provinsi',
              'users.username',
              'user_provinsi.username'
            )
            .innerJoin(
              'user_provinsi_additional',
              'users.username',
              'user_provinsi_additional.username'
            )
            .where('users.username', username)
            .first();
        } else if(role == 'kota') {
          return knex
            .select(getKotaTable)
            .from('users')
            .innerJoin(
              'user_kota',
              'users.username',
              'user_kota.username'
            )
            .innerJoin(
              'user_kota_additional',
              'users.username',
              'user_kota_additional.username'
            )
            .where('users.username', username)
            .first();
        } else if(role == 'puskesmas') {
          return knex
            .select(getPuskesmasTable)
            .from('users')
            .innerJoin(
              'user_puskesmas',
              'users.username',
              'user_puskesmas.username'
            )
            .innerJoin(
              'user_puskesmas_additional',
              'users.username',
              'user_puskesmas_additional.username'
            )
            .where('users.username', username)
            .first();
        } else if(role == 'kestrad') {
          return knex
            .select(getKestradTable)
            .from('users')
            .innerJoin(
              'user_kestrad',
              'users.username',
              'user_kestrad.username'
            )
            .innerJoin(
              'user_kestrad_additional',
              'users.username',
              'user_kestrad_additional.username'
            )
            .where('users.username', username)
            .first();
        } else {
          return knex
            .select(userColumns)
            .from('users')
            .where('username', username)
        }
      });
  },

  updateUser: (username, userUpdates) => {
    let promises = Promise.resolve();
    if (userUpdates.password) {
      promises = promises.then(() => {
        return bcrypt.hash(userUpdates.password, BCRYPT_STRENGTH);
      });
    }
    userUpdates = _.pick(userUpdates, userAssignableColumns);
    userUpdates.updated_at = new Date();
    return knex
      .select('role')
      .from('users')
      .where('username', username)
      .then(result => {
        const { role } = result;
        if (role === 'admin') {
          return promises.then(hash => {
            userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
            return knex('users')
              .update(userUpdates)
              .where('username', username);
          });
        } else {
          return promises.then(hash => {
            userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
            return knex('users')
              .update(userUpdates)
              .where('username', username)
              .then(() => {
                knex(role)
                  .update(userUpdates)
                  .where('username', username);
              });
          });
        }
      });
  },

  deleteUser: username => {
    return knex
      .select('role')
      .from('users')
      .where('username', username)
      .first()
      .then(result => {
        const { role } = result;
        if (role === 'provinsi') {
          return knex('user_provinsi')
            .delete()
            .where('username', username);
        } else if (role === 'kota') {
          return knex('user_kota')
            .delete()
            .where('username', username);
        } else if (role === 'puskesmas') {
          return knex('user_puskesmas')
            .delete()
            .where('username', username);
        } else {
          return knex('user_kestrad')
            .delete()
            .where('username', username);
        }
      })
      .then(affectedRowCount => {
        return knex('users')
          .delete()
          .where('username', username)
          .then(affectedRow => affectedRow + affectedRowCount);
      });
  },

  resetPassword: (userUpdates , username, username_changer, changer_role) => {
    let promises = Promise.resolve();
    if (userUpdates.password) {
      promises = promises.then(() => {
        return bcrypt.hash(userUpdates.password, BCRYPT_STRENGTH);
      });
    }
    let promises2 = Promise.resolve();
    promises2 = promises2.then(() => {
      return knex()
        .select('role')
        .from('users')
        .where('username', username)
        .map(function(row) {
          return row.role;
        });
    });
    if(changer_role == 'admin') {
      return promises.then(hash => {
        userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
        return knex('users')
          .update(userUpdates)
          .where('username', username);
      });
    } else if (changer_role == 'provinsi') {
      return promises.then(hash => {
        userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
        return promises2.then(role => {
          if(role != 'provinsi' && role != 'admin') {
            return knex('users')
            .update(userUpdates)
            .where('username', username);
          } else {
            throw new errors.Forbidden();
          }
        });
      });
    } else if (changer_role == 'kota') {
      return promises.then(hash => {
        userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
        return promises2.then(role => {
          if(role != 'provinsi' && role != 'admin' && role != 'kota') {
            return knex('users')
            .update(userUpdates)
            .where('username', username);
          } else {
            throw new errors.Forbidden();
          }
        });
      });
    } else {
      return promises.then(hash => {
        userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
        return promises2.then(role => {
          if(role == 'kestrad') {
            return knex('users')
            .update(userUpdates)
            .where('username', username);
          } else {
            throw new errors.Forbidden();
          }
        });
      });
    }
  }
};
