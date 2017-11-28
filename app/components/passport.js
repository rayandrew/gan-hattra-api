'use strict';

/**
 * @module app/components/passport
 */

const passport = require('passport');
const LocalStrategy = require('passport-local');
const knex = require('./knex.js');
const bcrypt = require('bcryptjs');
const errors = require('http-errors');
const auth = require('./auth.js');

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
  'updated_at',
  'kecamatan',
  'penanggung_jawab'
];

const kotaAdditional = ['user_kota.username_provinsi'];

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
  'kepala_dinas',
  'nama',
  'alamat',
  'penanggung_jawab',
  'kecamatan'
];

const getProvinsiTable = userColumns
  .concat(middleTable.slice(0, 3))
  .concat(countAdditional);

const getKotaTable = userColumns
  .concat(kotaAdditional)
  .concat(middleTable.slice(0, 3))
  .concat(countAdditional.slice(1, 7));

const getPuskesmasTable = userColumns
  .concat(puskesmasAdditional)
  .concat(middleTable.slice(0, 3))
  .concat(countAdditional.slice(2, 7));

const getKestradTable = userColumns
  .concat(kestradAdditional)
  .concat(middleTable.slice(2, 6))
  .concat(countAdditional.slice(3, 7));

const userColumnsWithoutPassword = userColumns.filter(
  column => column !== 'password'
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    (username, password, done) => {
      knex
        .first(userColumns)
        .from('users')
        .where('username', username)
        .then(function (user) {
          if (!user) {
            return done(new errors.Unauthorized('Wrong username or password.'));
          }
          return bcrypt.compare(password, user.password).then(res => {
            if (!res) {
              return done(
                new errors.Unauthorized('Wrong username or password.')
              );
            }
            if (!auth.predicates.isActive(user)) {
              return done(new errors.Forbidden('Account inactive.'));
            }
            delete user.password;
            return user;
          });
        })
        .then(user => {
          if (user.role === 'provinsi') {
            return knex('users')
              .select(getProvinsiTable)
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
              .where('users.username', user.username)
              .first();
          } else if (user.role === 'kota') {
            return knex('users')
              .select(getKotaTable)
              .innerJoin('user_kota', 'users.username', 'user_kota.username')
              .innerJoin(
                'user_kota_additional',
                'users.username',
                'user_kota_additional.username'
              )
              .where('users.username', user.username)
              .first();
          } else if (user.role === 'puskesmas') {
            return knex('users')
              .select(getPuskesmasTable)
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
              .where('users.username', user.username)
              .first();
          } else if (user.role === 'kestrad') {
            return knex('users')
              .select(getKestradTable)
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
              .where('users.username', user.username)
              .first();
          } else {
            return knex
              .select(userColumns)
              .from('users')
              .where('username', user.username)
              .first();
          }
        })
        .then(user => done(null, user))
        .catch(done);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  knex
    .first(userColumnsWithoutPassword)
    .from('users')
    .where('username', username)
    .then(user => {
      if (user.role === 'provinsi') {
        return knex('users')
          .select(getProvinsiTable)
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
          .where('users.username', user.username)
          .first();
      } else if (user.role === 'kota') {
        return knex('users')
          .select(getKotaTable)
          .innerJoin('user_kota', 'users.username', 'user_kota.username')
          .innerJoin(
            'user_kota_additional',
            'users.username',
            'user_kota_additional.username'
          )
          .where('users.username', user.username)
          .first();
      } else if (user.role === 'puskesmas') {
        return knex('users')
          .select(getPuskesmasTable)
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
          .where('users.username', user.username)
          .first();
      } else if (user.role === 'kestrad') {
        return knex('users')
          .select(getKestradTable)
          .innerJoin('user_kestrad', 'users.username', 'user_kestrad.username')
          .innerJoin(
            'user_kestrad_additional',
            'users.username',
            'user_kestrad_additional.username'
          )
          .where('users.username', user.username)
          .first();
      } else {
        return knex
          .select(userColumns)
          .from('users')
          .where('username', user.username)
          .first();
      }
    })
    .then(function (user) {
      done(null, user);
    })
    .catch(done);
});

/** A [Passport](http://passportjs.org/) instance set up to use a local authentication strategy (with local username/password). */
module.exports = passport;
