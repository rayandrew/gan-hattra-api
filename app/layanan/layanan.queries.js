"use strict";

var knex = require("../components/knex.js");
var helper = require("../common/helper.js");
const errors = require("http-errors");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

const kategoriColumns = ["id_kategori", "nama_kategori"];

const kategoriSearchableColumns = ["nama_kategori"];

const subKategoriColumns = [
  "id_subkategori",
  "id_kategori",
  "nama_subkategori"
];

const subKategoriSearchableColumns = ["nama_kategori", "nama_subkategori"];

const layananColumns = [
  "id_layanan",
  "id_subkategori",
  "username_kestrad",
  "nama_layanan",
  "verified",
  "tanggal_verified",
  "created_at",
  "updated_at"
];

const displayColumns = [
  "username_provinsi",
  "username_kota",
  "username_puskesmas",
  "count_hattra_verified",
  "count_hattra_not_verified"
];

const layananSearchableColumns = ["nama_layanan", "verified"];

const layananAssignableColumns = ["nama_layanan", "verified"];

module.exports = {
  listLayanan: (search, page, perPage, sort) => {
    return knex("layanan")
      .select(
        layananColumns
          .map(column => "layanan." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "layanan_additional",
        "layanan.id_layanan",
        "layanan_additional.id_layanan"
      )
      .search(
        search,
        layananSearchableColumns.map(column => "layanan." + column)
      )
      .pageAndSort(page, perPage, sort, layananColumns.concat(displayColumns));
  },

  getLayananForProvinsi: (search, page, perPage, sort, username) =>
    knex("layanan")
      .select(
        layananColumns
          .map(column => "layanan." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "layanan_additional",
        "layanan.id_layanan",
        "layanan_additional.id_layanan"
      )
      .where("username_provinsi", username)
      .search(
        search,
        layananSearchableColumns.map(column => "layanan." + column)
      )
      .pageAndSort(page, perPage, sort, layananColumns.concat(displayColumns)),

  getLayananForKota: (search, page, perPage, sort, username) =>
    knex("layanan")
      .select(
        layananColumns
          .map(column => "layanan." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "layanan_additional",
        "layanan.id_layanan",
        "layanan_additional.id_layanan"
      )
      .where("username_kota", username)
      .search(
        search,
        layananSearchableColumns.map(column => "layanan." + column)
      )
      .pageAndSort(page, perPage, sort, layananColumns.concat(displayColumns)),

  getLayananForPuskesmas: (search, page, perPage, sort, username) =>
    knex("layanan")
      .select(
        layananColumns
          .map(column => "layanan." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "layanan_additional",
        "layanan.id_layanan",
        "layanan_additional.id_layanan"
      )
      .where("username_puskesmas", username)
      .search(
        search,
        layananSearchableColumns.map(column => "layanan." + column)
      )
      .pageAndSort(page, perPage, sort, layananColumns.concat(displayColumns)),

  getLayananForKestrad: (search, page, perPage, sort, username) =>
    knex("layanan")
      .select(
        layananColumns
          .map(column => "layanan." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "layanan_additional",
        "layanan.id_layanan",
        "layanan_additional.id_layanan"
      )
      .where("layanan.username_kestrad", username)
      .search(
        search,
        layananSearchableColumns.map(column => "layanan." + column)
      )
      .pageAndSort(page, perPage, sort, layananColumns.concat(displayColumns)),

  listLayananByUsername: (
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
            return module.exports.getLayananForProvinsi(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          } else if (role === "kota") {
            return module.exports.getLayananForKota(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          } else if (role === "puskesmas") {
            return module.exports.getLayananForPuskesmas(
              search,
              page,
              perPage,
              sort,
              usernameListed
            );
          } else if (role === "kestrad") {
            return module.exports.getLayananForKestrad(
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
              let getUser = knex("layanan_additional")
                .select("username_provinsi")
                .where("username_provinsi", usernameLister)
                .andWhere("username_kota", usernameListed);

              return getUser.then(provinsi => {
                if (provinsi) {
                  return module.exports.getLayananForKota(
                    search,
                    page,
                    perPage,
                    sort,
                    usernameListed
                  );
                } else {
                  throw new errors.Forbidden();
                }
              });
            } else if (role === "puskesmas") {
              return knex("layanan_additional")
                .select("username_provinsi")
                .where("username_provinsi", usernameLister)
                .andWhere("username_puskesmas", usernameListed)
                .then(provinsi => {
                  if (!provinsi) {
                    throw new errors.Forbidden();
                  }

                  return module.exports.getLayananForPuskesmas(
                    search,
                    page,
                    perPage,
                    sort,
                    usernameListed
                  );
                });
            } else if (role === "kestrad") {
              return knex("layanan_additional")
                .select("username_provinsi")
                .where("username_provinsi", usernameLister)
                .andWhere("username_kestrad", usernameListed)
                .then(provinsi => {
                  if (!provinsi) {
                    throw new errors.Forbidden();
                  }

                  return module.exports.getLayananForKestrad(
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
          }
        } else if (usernameRole === "kota") {
          if (role === "admin" || role === "provinsi" || role === "kota") {
            throw new errors.Forbidden();
          } else {
            if (role === "puskesmas") {
              return knex("layanan_additional")
                .select("username_kota")
                .where("username_kota", usernameLister)
                .andWhere("username_puskesmas", usernameListed)
                .then(kota => {
                  if (!kota) {
                    throw new errors.Forbidden();
                  }

                  return module.exports.getLayananForPuskesmas(
                    search,
                    page,
                    perPage,
                    sort,
                    usernameListed
                  );
                });
            } else if (role === "kestrad") {
              return knex("layanan_additional")
                .select("username_kota")
                .where("username_kota", usernameLister)
                .andWhere("username_kestrad", usernameListed)
                .then(kota => {
                  if (!kota) {
                    throw new errors.Forbidden();
                  }
                  return module.exports.getLayananForKestrad(
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
          }
        } else if (usernameRole === "puskesmas") {
          if (role !== "kestrad") {
            throw new errors.Forbidden();
          }

          return knex("layanan_additional")
            .select("username_puskesmas")
            .where("username_puskesmas", usernameLister)
            .andWhere("username_kestrad", usernameListed)
            .then(puskesmas => {
              if (!puskesmas) {
                throw new errors.Forbidden();
              }

              return module.exports.getLayananForKestrad(
                search,
                page,
                perPage,
                sort,
                usernameListed
              );
            });
        }

        throw new errors.Forbidden();
      }),

  searchLayanan: (search, page, perPage, sort) =>
    knex("layanan")
      .select(
        layananColumns
          .map(column => "layanan." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "layanan_additional",
        "layanan.id_layanan",
        "layanan_additional.id_layanan"
      )
      .search(
        search,
        layananSearchableColumns.map(column => "layanan." + column)
      )
      .pageAndSort(page, perPage, sort, layananColumns.concat(displayColumns)),

  getSpecificLayanan: id =>
    knex("layanan")
      .first(
        layananColumns
          .map(column => "layanan." + column + " as " + column)
          .concat(displayColumns)
      )
      .innerJoin(
        "layanan_additional",
        "layanan.id_layanan",
        "layanan_additional.id_layanan"
      )
      .where("layanan.id_layanan", id),

  listKategori: (search, page, perPage, sort) =>
    knex("kategori")
      .select(
        kategoriColumns.map(column => "kategori." + column + " as " + column)
      )
      .search(
        search,
        kategoriSearchableColumns.map(column => "kategori." + column)
      )
      .pageAndSort(page, perPage, sort, kategoriColumns),

  listSubKategori: (search, page, perPage, sort) =>
    knex("subkategori")
      .select(
        subKategoriColumns
          .map(column => "subkategori." + column + " as " + column)
          .concat(kategoriColumns.slice(1))
      )
      .innerJoin("kategori", "kategori.id_kategori", "subkategori.id_kategori"),

  updateNamaLayanan: (id_layanan, layananUpdates, username) =>
    knex("layanan")
      .first()
      .innerJoin(
        "layanan_additional",
        "layanan.id_layanan",
        "layanan_additional.id_layanan"
      )
      .where("username_puskesmas", username)
      .andWhere("layanan.id_layanan", id_layanan)
      .then(layanan => {
        if (!layanan) {
          throw new errors.NotFound();
        }

        const tempLayananUpdates = _.pick(
          layananUpdates,
          layananAssignableColumns
        );

        return knex("layanan")
          .update(tempLayananUpdates)
          .where("id_layanan", id_layanan);
      }),

  updateVerifikasiLayanan: (id_layanan, layananUpdates, username) =>
    knex("layanan")
      .first()
      .innerJoin(
        "layanan_additional",
        "layanan.id_layanan",
        "layanan_additional.id_layanan"
      )
      .where("username_kota", username)
      .andWhere("layanan.id_layanan", id_layanan)
      .then(layanan => {
        if (!layanan) {
          throw new errors.NotFound("Layanan not found!");
        }

        let tempLayananUpdates = _.pick(
          layananUpdates,
          layananAssignableColumns
        );

        if (tempLayananUpdates.verified === "active") {
          tempLayananUpdates.tanggal_verified = new Date();
        } else {
          tempLayananUpdates.tanggal_verified = null;
        }

        return knex("layanan")
          .update(tempLayananUpdates)
          .where("id_layanan", id_layanan);
      })
};
