"use strict";

var knex = require("../components/knex.js");
var helper = require("../common/helper.js");
const errors = require("http-errors");
const _ = require("lodash");

const hattraColumns = [
  "id_hattra",
  "id_layanan",
  "nama",
  "ijin_hattra",
  "verified",
  "tanggal_verified",
  "created_at",
  "updated_at"
];

const hattraSearchableColumns = [
  "id_hattra",
  "id_layanan",
  "nama",
  "ijin_hattra",
  "verified"
];

const hattraAssignableColumns = ["nama_layanan", "ijin_hattra", "verified"];

const displayColumns = [
  "username_provinsi",
  "username_kota",
  "username_puskesmas",
  "username_kestrad"
];

module.exports = {
  listHattra: (search, page, perPage, sort) =>
    knex("hattra")
      .select(
        hattraColumns
          .map(column => "hattra." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .search(search, hattraSearchableColumns.map(column => "hattra." + column))
      .pageAndSort(page, perPage, sort, hattraColumns.concat(displayColumns)),

  listHattraByKestrad: (search, page, perPage, sort, user) =>
    knex("hattra")
      .select(
        hattraColumns
          .map(column => "hattra." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .where("username_kestrad", user)
      .search(search, hattraSearchableColumns.map(column => "hattra." + column))
      .pageAndSort(page, perPage, sort, hattraColumns.concat(displayColumns)),

  listHattraByPuskesmas: (search, page, perPage, sort, user) =>
    knex("hattra")
      .select(
        hattraColumns
          .map(column => "hattra." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .where("username_puskesmas", user)
      .search(search, hattraSearchableColumns.map(column => "hattra." + column))
      .pageAndSort(page, perPage, sort, hattraColumns.concat(displayColumns)),

  listHattraByKota: (search, page, perPage, sort, user) =>
    knex("hattra")
      .select(
        hattraColumns
          .map(column => "hattra." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .where("username_kota", user)
      .search(search, hattraSearchableColumns.map(column => "hattra." + column))
      .pageAndSort(page, perPage, sort, hattraColumns.concat(displayColumns)),

  listHattraByProvinsi: (search, page, perPage, sort, user) =>
    knex("hattra")
      .select(
        hattraColumns
          .map(column => "hattra." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .where("username_provinsi", user)
      .search(search, hattraSearchableColumns.map(column => "hattra." + column))
      .pageAndSort(page, perPage, sort, hattraColumns.concat(displayColumns)),

  listHattraByUsername: (
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
        if (role) {
          if (usernameRole === "admin") {
            if (role === "provinsi") {
              return module.exports.listHattraByProvinsi(
                search,
                page,
                perPage,
                sort,
                usernameListed
              );
            } else if (role === "kota") {
              return module.exports.listHattraByKota(
                search,
                page,
                perPage,
                sort,
                usernameListed
              );
            } else if (role === "puskesmas") {
              return module.exports.listHattraByPuskesmas(
                search,
                page,
                perPage,
                sort,
                usernameListed
              );
            } else if (role === "kestrad") {
              return module.exports.listHattraByKestrad(
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
            if (role === "kota") {
              const getUser = knex("hattra_additional")
                .select("username_provinsi")
                .where("username_provinsi", usernameLister)
                .andWhere("username_kota", usernameListed);

              return getUser.then(provinsi => {
                if (!provinsi) {
                  throw new errors.Forbidden();
                }

                return module.exports.listHattraByKota(
                  search,
                  page,
                  perPage,
                  sort,
                  usernameListed
                );
              });
            } else if (role === "puskesmas") {
              const getUser = knex("hattra_additional")
                .select("username_provinsi")
                .where("username_provinsi", usernameLister)
                .andWhere("username_puskesmas", usernameListed);

              return getUser.then(provinsi => {
                if (!provinsi) {
                  throw new errors.Forbidden();
                }

                return module.exports.listHattraByPuskesmas(
                  search,
                  page,
                  perPage,
                  sort,
                  usernameListed
                );
              });
            } else if (role === "kestrad") {
              const getUser = knex("hattra_additional")
                .select("username_provinsi")
                .where("username_provinsi", usernameLister)
                .andWhere("username_kestrad", usernameListed);

              return getUser.then(provinsi => {
                if (!provinsi) {
                  throw new errors.Forbidden();
                }

                return module.exports.listHattraByKestrad(
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
          } else if (usernameRole === "kota") {
            if (role === "puskesmas") {
              const getUser = knex("hattra_additional")
                .select("username_kota")
                .where("username_kota", usernameLister)
                .andWhere("username_puskesmas", usernameListed);

              return getUser.then(kota => {
                if (!kota) {
                  throw new errors.Forbidden();
                }

                return module.exports.listHattraByPuskesmas(
                  search,
                  page,
                  perPage,
                  sort,
                  usernameListed
                );
              });
            } else if (role === "kestrad") {
              const getUser = knex("hattra_additional")
                .select("username_kota")
                .where("username_kota", usernameLister)
                .andWhere("username_kestrad", usernameListed);

              return getUser.then(kota => {
                if (!kota) {
                  throw new errors.Forbidden();
                }

                return module.exports.listHattraByKestrad(
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
          } else if (usernameRole === "puskesmas") {
            if (role !== "kestrad") {
              throw new errors.Forbidden();
            }

            const getUser = knex("hattra_additional")
              .select("username_puskesmas")
              .where("username_puskesmas", usernameLister)
              .andWhere("username_kestrad", usernameListed);

            return getUser.then(puskesmas => {
              if (!puskesmas) {
                throw new errors.Forbidden();
              }

              return module.exports.listHattraByKestrad(
                search,
                page,
                perPage,
                sort,
                usernameListed
              );
            });
          }
        } else {
          throw new errors.Forbidden();
        }
      }),

  listHattraByLayanan: (search, page, perPage, sort, id) =>
    knex("hattra")
      .select(
        hattraColumns
          .map(column => "hattra." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .where("hattra.id_layanan", id)
      .search(search, hattraSearchableColumns.map(column => "hattra." + column))
      .pageAndSort(page, perPage, sort, hattraColumns.concat(displayColumns)),

  searchHattra: search =>
    knex("hattra")
      .select(
        hattraColumns
          .map(column => "hattra." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .search(search, hattraSearchableColumns.map(column => "hattra." + column))
      .limit(20),

  searchHattraForKestrad: search =>
    knex("hattra")
      .select(
        hattraColumns
          .map(column => "hattra." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .search(search, hattraSearchableColumns.map(column => "hattra." + column))
      .limit(20),

  searchHattraForPuskesmas: (search, username) =>
    knex("hattra")
      .select(
        hattraColumns
          .map(column => "hattra." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .where("username_puskesmas", username)
      .search(search, hattraSearchableColumns.map(column => "hattra." + column))
      .limit(20),

  searchHattraForKota: (search, username) =>
    knex("hattra")
      .select(
        hattraColumns
          .map(column => "hattra." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .where("user_puskesmas.username_kota", username)
      .search(search, hattraSearchableColumns.map(column => "hattra." + column))
      .limit(20),

  searchHattraForProvinsi: (search, username) =>
    knex("hattra")
      .select(
        hattraColumns
          .map(column => "hattra." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .where("user_kota.username_provinsi", username)
      .search(search, hattraSearchableColumns.map(column => "hattra." + column))
      .limit(20),

  getSpecificHattra: id =>
    knex("hattra")
      .first(
        hattraColumns
          .map(column => "hattra." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .where("hattra.id_hattra", id),

  updateNamaHattra: (id_hattra, hattraUpdates, username) =>
    knex("hattra")
      .first()
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .where("username_puskesmas", username)
      .then(hattra => {
        if (!hattra) {
          throw new errors.NotFound();
        }

        const tempHattraUpdates = _.pick(
          hattraUpdates,
          hattraAssignableColumns
        );

        return knex("hattra")
          .update(tempHattraUpdates)
          .where("id_hattra", id_layanan);
      }),

  updateVerifikasiHattra: (id_hattra, hattraUpdates, username) =>
    knex("hattra")
      .first()
      .innerJoin(
        "hattra_additional",
        "hattra.id_hattra",
        "hattra_additional.id_hattra"
      )
      .where("username_kota", username)
      .then(hattra => {
        if (!hattra) {
          throw new errors.NotFound();
        }

        let tempHattraUpdates = _.pick(hattraUpdates, hattraAssignableColumns);
        if (tempHattraUpdates.verified === "active") {
          tempHattraUpdates.tanggal_verified = new Date();
        }

        return knex("hattra")
          .update(tempHattraUpdates)
          .where("id_hattra", id_hattra);
      })
};
