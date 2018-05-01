"use strict";

const errors = require("http-errors");
const _ = require("lodash");
const knex = require("../components/knex.js");
const helper = require("../common/helper.js");

const kotaColumns = [
  "username",
  "username_provinsi",
  "nama",
  "kepala_dinas",
  "alamat",
  "created_at",
  "updated_at"
];

const displayColumns = [
  "count_puskesmas",
  "count_kestrad",
  "count_layanan_verified",
  "count_layanan_not_verified",
  "count_hattra_verified",
  "count_hattra_not_verified"
];

const kotaUpdateableColumns = ["nama", "kepala_dinas", "alamat"];
const kotaSearchableColumns = [
  "username",
  "username_provinsi",
  "nama",
  "kepala_dinas",
  "alamat"
];

const kotaSortableColumns = [
  "username",
  "username_provinsi",
  "nama",
  "kepala_dinas",
  "alamat",
  "created_at",
  "updated_at"
];

module.exports = {
  listKota: (search, page, perPage, sort) =>
    knex("user_kota")
      .select(
        kotaColumns
          .map(column => "user_kota." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "user_kota_additional",
        "user_kota.username",
        "user_kota_additional.username"
      )
      .search(
        search,
        kotaSearchableColumns.map(column => "user_kota." + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kotaSortableColumns.concat(displayColumns)
      ),

  searchUsers: (search, page, perPage, sort) =>
    knex("user_kota")
      .select(
        kotaColumns
          .map(column => "user_kota." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "user_kota_additional",
        "user_kota.username",
        "user_kota_additional.username"
      )
      .search(
        search,
        kotaSearchableColumns.map(column => "user_kota." + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kotaSortableColumns.concat(displayColumns)
      ),

  getSpecificKota: username =>
    knex("user_kota")
      .first(
        kotaColumns
          .map(column => "user_kota." + column + " as " + column)
          .concat(displayColumns)
      )
      .where("user_kota.username", username)
      .innerJoin(
        "user_kota_additional",
        "user_kota.username",
        "user_kota_additional.username"
      ),

  getKotaForProvinsi: (search, page, perPage, sort, username) =>
    knex("user_kota")
      .select(
        kotaColumns
          .map(column => "user_kota." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "user_kota_additional",
        "user_kota.username",
        "user_kota_additional.username"
      )
      .where("user_kota.username_provinsi", username)
      .search(
        search,
        kotaSearchableColumns.map(column => "user_kota." + column)
      )
      .pageAndSort(
        page,
        perPage,
        sort,
        kotaSortableColumns.concat(displayColumns)
      ),

  listKotaByUsername: (
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
          return new errors.Forbidden();
        }

        if (usernameRole === "admin") {
          if (role !== "provinsi") {
            throw new errors.Forbidden();
          }

          return module.exports.getKotaForProvinsi(
            search,
            page,
            perPage,
            sort,
            usernameListed
          );
        }
        throw new errors.Forbidden();
      }),

  updateKota: (username, kotaUpdates) => {
    const tempKotaUpdates = _.pick(kotaUpdates, kotaUpdateableColumns);
    kotaUpdates.updated_at = new Date();
    return knex("user_kota")
      .update(tempKotaUpdates)
      .where("username", username);
  }
};
