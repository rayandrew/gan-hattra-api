"use strict";

var knex = require("../components/knex.js");
const errors = require("http-errors");
const _ = require("lodash");
const user = require("../users/users.queries.js");

const provinsiColumns = ["username", "nama", "kepala_dinas", "alamat"];

const provinsiUpdatableColumns = ["nama", "kepala_dinas", "alamat"];

const provinsiSearchableColumns = ["nama", "kepala_dinas", "alamat"];

const displayColumns = [
  "count_kota",
  "count_puskesmas",
  "count_kestrad",
  "count_layanan_verified",
  "count_layanan_not_verified",
  "count_hattra_verified",
  "count_hattra_not_verified"
];
// const userSortableColumns = ['username', 'email', 'role', 'status', 'created_at', 'updated_at'];

module.exports = {
  listProvinsi: (search, page, perPage, sort) => {
    return knex("user_provinsi")
      .select(
        provinsiColumns
          .map(column => "user_provinsi." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "user_provinsi_additional",
        "user_provinsi.username",
        "user_provinsi_additional.username"
      )
      .search(
        search,
        provinsiSearchableColumns.map(column => "user_provinsi." + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        provinsiColumns.map(column => "user_provinsi." + column)
      );
  },

  searchProvinsi: (search, page, perPage, sort) => {
    return knex("user_provinsi")
      .select(
        provinsiColumns
          .map(column => "user_provinsi." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "user_provinsi_additional",
        "user_provinsi.username",
        "user_provinsi_additional.username"
      )
      .search(
        search,
        provinsiSearchableColumns.map(column => "user_provinsi." + column)
      )
      .limit(20)
      .pageAndSort(
        page,
        perPage,
        sort,
        provinsiColumns.map(column => "user_provinsi." + column)
      );
  },

  createProvinsi: newProvinsi => {
    return user.createUser(newProvinsi);
  },

  getProvinsi: username => {
    return knex("user_provinsi")
      .first(
        provinsiColumns
          .map(column => "user_provinsi." + column + " as " + column)
          .concat(displayColumns)
      )
      .where("user_provinsi.username", username)
      .innerJoin(
        "user_provinsi_additional",
        "user_provinsi.username",
        "user_provinsi_additional.username"
      );
  },

  updateProvinsi: (username, userUpdates) => {
    let tempUserUpdates = _.pick(userUpdates, provinsiUpdatableColumns);
    tempUserUpdates.updated_at = new Date();
    return knex("user_provinsi")
      .update(tempUserUpdates)
      .where("username", username);
  }
};
