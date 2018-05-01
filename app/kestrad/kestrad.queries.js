"use strict";

const errors = require("http-errors");
const _ = require("lodash");
const knex = require("../components/knex.js");
const helper = require("../common/helper.js");

const kestradColumns = [
  "username",
  "username_puskesmas",
  "nama",
  "penanggung_jawab",
  "alamat",
  "kecamatan",
  "created_at",
  "updated_at"
];

const displayColumns = [
  "username_provinsi",
  "username_kota",
  "count_layanan_verified",
  "count_layanan_not_verified",
  "count_hattra_verified",
  "count_hattra_not_verified"
];
const kestradSearchableColumns = ["username", "username_puskesmas", "nama"];

const kestradAssignableColumns = [
  "kecamatan",
  "nama",
  "kepala_dinas",
  "alamat"
];

const insertLayananColumns = [
  "id_subkategori",
  "username_kestrad",
  "nama_layanan",
  "verified"
];

const insertHattraColumns = ["id_layanan", "nama", "ijin_hattra", "verified"];

module.exports = {
  listKestrad: (search, page, perPage, sort) =>
    knex("user_kestrad")
      .select(
        kestradColumns
          .map(column => "user_kestrad." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "user_kestrad_additional",
        "user_kestrad.username",
        "user_kestrad_additional.username"
      )
      .search(
        search,
        kestradSearchableColumns.map(column => "user_kestrad." + column)
      )
      .pageAndSort(page, perPage, sort, kestradColumns.concat(displayColumns)),

  listKestradByPuskesmas: (search, page, perPage, sort, user) =>
    knex("user_kestrad")
      .select(
        kestradColumns
          .map(column => "user_kestrad." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "user_kestrad_additional",
        "user_kestrad.username",
        "user_kestrad_additional.username"
      )
      .where("user_kestrad.username_puskesmas", user)
      .search(
        search,
        kestradSearchableColumns.map(column => "user_kestrad." + column)
      )
      .pageAndSort(page, perPage, sort, kestradColumns.concat(displayColumns)),

  listKestradByKota: (search, page, perPage, sort, user) =>
    knex("user_kestrad")
      .select(
        kestradColumns
          .map(column => "user_kestrad." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "user_kestrad_additional",
        "user_kestrad.username",
        "user_kestrad_additional.username"
      )
      .where("username_kota", user)
      .search(
        search,
        kestradSearchableColumns.map(column => "user_kestrad." + column)
      )
      .pageAndSort(page, perPage, sort, kestradColumns.concat(displayColumns)),

  listKestradByProvinsi: (search, page, perPage, sort, user) =>
    knex("user_kestrad")
      .select(
        kestradColumns
          .map(column => "user_kestrad." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "user_kestrad_additional",
        "user_kestrad.username",
        "user_kestrad_additional.username"
      )
      .where("username_provinsi", user)
      .search(
        search,
        kestradSearchableColumns.map(column => "user_kestrad." + column)
      )
      .pageAndSort(page, perPage, sort, kestradColumns.concat(displayColumns)),

  listKestradByUsername: (
    search,
    page,
    perPage,
    sort,
    usernameLister,
    usernameRole,
    usernameListed
  ) =>
    helper
      .getRole(usernameListed)
      .then(row => row.role)
      .then(role => {
        if (!role) {
          throw new errors.Forbidden();
        }

        if (usernameRole === "admin") {
          if (role === "provinsi") {
            return module.exports.listKestradByProvinsi(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          }
          if (role === "kota") {
            return module.exports.listKestradByKota(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          }
          if (role === "puskesmas") {
            return module.exports.listKestradByPuskesmas(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          }
          throw new errors.Forbidden();
        } else if (usernameRole === "provinsi") {
          if (role === "kota") {
            const getUser = knex("user_kestrad_additional")
              .first("username_provinsi")
              .where("username_provinsi", usernameLister)
              .andWhere("username_kota", usernameListed);

            return getUser.then(provinsi => {
              if (!provinsi) {
                throw new errors.Forbidden();
              }

              return module.exports.listKestradByKota(
                search,
                page,
                perPage,
                sort,
                usernameListed
              );
            });
          }
          if (role === "puskesmas") {
            const getUser = knex("user_kestrad_additional")
              .first("username_provinsi")
              .where("username_provinsi", usernameLister)
              .andWhere("username_puskesmas", usernameListed);

            return getUser.then(provinsi => {
              if (!provinsi) {
                throw new errors.Forbidden();
              }

              return module.exports.listKestradByPuskesmas(
                search,
                page,
                perPage,
                sort,
                usernameListed
              );
            });
          }
          throw new errors.Forbidden();
        } else if (usernameRole === "kota") {
          if (role !== "puskesmas") {
            throw new errors.Forbidden();
          }

          const getUser = knex("user_kestrad_additional")
            .first("username")
            .where("username_kota", usernameLister)
            .andWhere("username_puskesmas", usernameListed);

          return getUser.then(kota => {
            if (!kota) {
              throw new errors.Forbidden();
            }

            return module.exports.listKestradByPuskesmas(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          });
        } else {
          throw new errors.Forbidden();
        }
      }),

  searchKestrad: (search, page, perPage, sort) =>
    knex("user_kestrad")
      .select(
        kestradColumns
          .map(column => "user_kestrad." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "user_kestrad_additional",
        "user_kestrad.username",
        "user_kestrad_additional.username"
      )
      .search(
        search,
        kestradSearchableColumns.map(column => "user_kestrad." + column)
      )
      .pageAndSort(page, perPage, sort, kestradColumns.concat(displayColumns)),

  getKestradByUsername: username =>
    knex("user_kestrad")
      .first(
        kestradColumns
          .map(column => "user_kestrad." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "user_kestrad_additional",
        "user_kestrad.username",
        "user_kestrad_additional.username"
      )
      .where("user_kestrad.username", username),

  updateKestrad: (username, kestradUpdates, usernamePuskesmas) =>
    knex("user_kestrad")
      .first()
      .where("username", username)
      .andWhere("username_puskesmas", usernamePuskesmas)
      .then(kestrad => {
        if (!kestrad) {
          throw new errors.Forbidden();
        }

        const tempKestradUpdates = _.pick(
          kestradUpdates,
          kestradAssignableColumns
        );

        tempKestradUpdates.updated_at = new Date();
        return knex("user_kestrad")
          .update(tempKestradUpdates)
          .where("username", username);
      }),

  addLayanan: insertLayanan =>
    knex("layanan")
      .first("id_layanan")
      .where({
        username_kestrad: insertLayanan.username_kestrad,
        nama_layanan: insertLayanan.nama_layanan,
        id_subkategori: insertLayanan.id_subkategori
      })
      .then(existinglayanan => {
        if (existinglayanan) {
          throw new errors.Conflict("Layanan already exists.");
        }

        return Object.assign({}, _.pick(insertLayanan, insertLayananColumns), {
          created_at: new Date(),
          updated_at: new Date()
        });
      })
      .then(newLayanan => knex("layanan").insert(newLayanan)),

  addHattra: insertHattra =>
    knex
      .first("id_hattra")
      .from("hattra")
      .where({
        id_layanan: insertHattra.id_layanan,
        nama: insertHattra.nama
      })
      .then(existinghattra => {
        if (existinghattra) {
          throw new errors.Conflict("Hattra already exists.");
        }

        return Object.assign({}, _.pick(insertHattra, insertHattraColumns), {
          created_at: new Date(),
          updated_at: new Date()
        });
      })
      .then(newHattra => knex("hattra").insert(newHattra))
};
