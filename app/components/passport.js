"use strict";

/**
 * @module app/components/passport
 */

const passport = require("passport");
const LocalStrategy = require("passport-local");
const pick = require("lodash/pick");
const bcrypt = require("bcryptjs");
const errors = require("http-errors");
const knex = require("./knex.js");
const auth = require("./auth.js");

const userColumns = [
  "users.username",
  "email",
  "password",
  "role",
  "status",
  "users.created_at",
  "users.updated_at"
];

const kotaAdditional = ["user_kota.username_provinsi"];

const puskesmasAdditional = [
  "user_puskesmas_additional.username_provinsi",
  "user_puskesmas.username_kota"
];

const kestradAdditional = [
  "user_kestrad_additional.username_provinsi",
  "user_kestrad_additional.username_kota",
  "user_kestrad.username_puskesmas"
];

const countAdditional = [
  "count_kota",
  "count_puskesmas",
  "count_kestrad",
  "count_layanan_verified",
  "count_layanan_not_verified",
  "count_hattra_verified",
  "count_hattra_not_verified"
];

const middleTable = [
  "kepala_dinas",
  "nama",
  "alamat",
  "penanggung_jawab",
  "kecamatan"
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
  column => column !== "password"
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    (username, password, done) => {
      knex
        .first(userColumns)
        .from("users")
        .where("username", username)
        .then(user => {
          if (!user) {
            throw new errors.Unauthorized("Wrong username or password.");
          }

          return bcrypt.compare(password, user.password).then(res => {
            if (!res) {
              throw new errors.Unauthorized("Wrong username or password.");
            }
            if (!auth.predicates.isActive(user)) {
              throw new errors.Forbidden("Account inactive.");
            }
            delete user.password;
            return user;
          });
        })
        .then(user => {
          if (user.role === "provinsi") {
            return knex("users")
              .select(getProvinsiTable)
              .innerJoin(
                "user_provinsi",
                "users.username",
                "user_provinsi.username"
              )
              .innerJoin(
                "user_provinsi_additional",
                "users.username",
                "user_provinsi_additional.username"
              )
              .where("users.username", user.username)
              .first();
          }
          if (user.role === "kota") {
            return knex("users")
              .select(getKotaTable)
              .innerJoin("user_kota", "users.username", "user_kota.username")
              .innerJoin(
                "user_kota_additional",
                "users.username",
                "user_kota_additional.username"
              )
              .where("users.username", user.username)
              .first();
          }
          if (user.role === "puskesmas") {
            return knex("users")
              .select(getPuskesmasTable)
              .innerJoin(
                "user_puskesmas",
                "users.username",
                "user_puskesmas.username"
              )
              .innerJoin(
                "user_puskesmas_additional",
                "users.username",
                "user_puskesmas_additional.username"
              )
              .where("users.username", user.username)
              .first();
          }
          if (user.role === "kestrad") {
            return knex("users")
              .select(getKestradTable)
              .innerJoin(
                "user_kestrad",
                "users.username",
                "user_kestrad.username"
              )
              .innerJoin(
                "user_kestrad_additional",
                "users.username",
                "user_kestrad_additional.username"
              )
              .where("users.username", user.username)
              .first();
          }
          return knex
            .select(userColumns)
            .from("users")
            .where("username", user.username)
            .first();
        })
        .then(user => {
          delete user.password;
          done(null, user);
        })
        .catch(done);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  knex("users")
    .first(userColumnsWithoutPassword)
    .where("username", username)
    .then(user => {
      if (user.role === "provinsi") {
        return knex("users")
          .first(getProvinsiTable)
          .innerJoin(
            "user_provinsi",
            "users.username",
            "user_provinsi.username"
          )
          .innerJoin(
            "user_provinsi_additional",
            "users.username",
            "user_provinsi_additional.username"
          )
          .where("users.username", user.username);
      }
      if (user.role === "kota") {
        return knex("users")
          .first(getKotaTable)
          .innerJoin("user_kota", "users.username", "user_kota.username")
          .innerJoin(
            "user_kota_additional",
            "users.username",
            "user_kota_additional.username"
          )
          .where("users.username", user.username);
      }
      if (user.role === "puskesmas") {
        return knex("users")
          .first(getPuskesmasTable)
          .innerJoin(
            "user_puskesmas",
            "users.username",
            "user_puskesmas.username"
          )
          .innerJoin(
            "user_puskesmas_additional",
            "users.username",
            "user_puskesmas_additional.username"
          )
          .where("users.username", user.username);
      }
      if (user.role === "kestrad") {
        return knex("users")
          .first(getKestradTable)
          .innerJoin("user_kestrad", "users.username", "user_kestrad.username")
          .innerJoin(
            "user_kestrad_additional",
            "users.username",
            "user_kestrad_additional.username"
          )
          .where("users.username", user.username);
      }
      return knex
        .first(userColumns)
        .from("users")
        .where("username", user.username);
    })
    .then(user => {
      done(null, pick(user, ["username", "email", "role", "status"]));
    })
    .catch(done);
});

/** A [Passport](http://passportjs.org/) instance set up to use a local authentication strategy (with local username/password). */
module.exports = passport;
