"use strict";

var knex = require("../components/knex.js");
var helper = require("../common/helper.js");
const errors = require("http-errors");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const puskesmasColumns = [
  "username",
  "username_kota",
  "nama",
  "kepala_dinas",
  "alamat",
  "created_at",
  "updated_at"
];

const displayColumns = [
  "username_provinsi",
  "count_kestrad",
  "count_layanan_verified",
  "count_layanan_not_verified",
  "count_hattra_verified",
  "count_hattra_not_verified"
];

const puskesmasUpdateableColumns = ["nama", "kepala_dinas", "alamat"];
const puskesmasSearchableColumns = [
  "user_puskesmas.username",
  "user_puskesmas.username_kota",
  "username_provinsi",
  "nama",
  "kepala_dinas",
  "alamat"
];
const puskesmasSortableColumns = ["username", "kepala_dinas", "alamat"];

module.exports = {
  listPuskesmas: (search, page, perPage, sort) => {
    return knex("user_puskesmas")
      .select(
        puskesmasColumns
          .map(column => "user_puskesmas." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "user_puskesmas_additional",
        "user_puskesmas.username",
        "user_puskesmas_additional.username"
      )
      .search(
        search,
        puskesmasSearchableColumns.map(column => "user_puskesmas." + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        puskesmasColumns.concat(displayColumns)
      );
  },

  searchPuskesmas: search => {
    return knex("user_puskesmas")
      .select(
        puskesmasColumns.map(
          column =>
            "user_puskesmas." + column + " as " + column.concat(displayColumns)
        )
      )
      .innerJoin(
        "user_puskesmas_additional",
        "user_puskesmas.username",
        "user_puskesmas_additional.username"
      )
      .search(
        search,
        puskesmasSearchableColumns.map(column => "user_puskesmas." + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        puskesmasColumns.concat(displayColumns)
      );
  },

  getSpecificPuskesmas: username => {
    return knex("user_puskesmas")
      .first(
        puskesmasColumns
          .map(column => "user_puskesmas." + column + " as " + column)
          .concat(displayColumns)
      )
      .where("user_puskesmas.username", username)
      .innerJoin(
        "user_puskesmas_additional",
        "user_puskesmas.username",
        "user_puskesmas_additional.username"
      );
  },

  getPuskesmasForKota: (search, page, perPage, sort, username) => {
    return knex("user_puskesmas")
      .select(
        puskesmasColumns
          .map(column => "user_puskesmas." + column + " as " + column)
          .concat(displayColumns)
      )
      .where("user_puskesmas.username_kota", username)
      .innerJoin(
        "user_puskesmas_additional",
        "user_puskesmas.username",
        "user_puskesmas_additional.username"
      )
      .search(
        search,
        puskesmasSearchableColumns.map(column => "user_puskesmas." + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        puskesmasColumns.concat(displayColumns)
      );
  },

  getPuskesmasForProvinsi: (search, page, perPage, sort, username) => {
    return knex("user_puskesmas")
      .select(
        puskesmasColumns
          .map(column => "user_puskesmas." + column + " as " + column)
          .concat(displayColumns)
      )
      .where("username_provinsi", username)
      .innerJoin(
        "user_puskesmas_additional",
        "user_puskesmas.username",
        "user_puskesmas_additional.username"
      )
      .search(search, puskesmasSearchableColumns)
      .pageAndSort(
        page,
        perPage,
        sort,
        puskesmasColumns.concat(displayColumns)
      );
  },

  getPuskesmas: username => {
    return knex("user_puskesmas")
      .first(puskesmasColumns)
      .where("username", username);
  },

  listPuskesmasByUsername: (
    search,
    page,
    perPage,
    sort,
    usernameLister,
    usernameRole,
    usernameListed
  ) => {
    return helper
      .getRole(usernameListed)
      .then(row => row.role)
      .then(role => {
        if (role) {
          if (usernameRole === "admin") {
            if (role === "provinsi") {
              return module.exports.getPuskesmasForProvinsi(
                search,
                page,
                perPage,
                sort,
                usernameListed
              );
            } else if (role === "kota") {
              return module.exports.getPuskesmasForKota(
                search,
                page,
                perPage,
                sort,
                usernameListed
              );
            } else {
              throw new errors.Forbidden();
            }
          } else if (usernameRole === "provinsi") {
            if (role === "admin" || role === "provinsi") {
              throw new errors.Forbidden();
            } else {
              if (role === "kota") {
                return knex("user_kestrad_additional")
                  .first("username_provinsi")
                  .where("username_provinsi", usernameLister)
                  .andWhere("username_kota", usernameListed)
                  .then(provinsi => {
                    if (!provinsi) {
                      throw new errors.Forbidden();
                    }

                    return module.exports.getPuskesmasForKota(
                      search,
                      page,
                      perPage,
                      sort,
                      usernameListed
                    );
                  });
              }
            }
          }
        } else {
          throw new errors.Forbidden();
        }
      });
  },

  updatePuskesmas: (username, puskesmasUpdates) => {
    let tempPuskesmasUpdates = _.pick(
      puskesmasUpdates,
      puskesmasUpdateableColumns
    );
    tempPuskesmasUpdates.updated_at = new Date();

    return knex("user_puskesmas")
      .update(tempPuskesmasUpdates)
      .where("username", username);
  }
};
