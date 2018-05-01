"use strict";

const errors = require("http-errors");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const knex = require("../components/knex.js");

const BCRYPT_STRENGTH = 8;

const userColumns = [
  "users.username",
  "email",
  "password",
  "role",
  "status",
  "users.created_at",
  "users.updated_at"
];

const userAssignableColumns = [
  "username",
  "email",
  "password",
  "role",
  "status"
];
const userSearchableColumns = ["username", "email"];
const userSortableColumns = [
  "username",
  "email",
  "role",
  "status",
  "created_at",
  "updated_at"
];
const specificUserColumns = [
  "username",
  "nama",
  "kepala_dinas",
  "alamat",
  "created_at",
  "updated_at",
  "kecamatan",
  "penanggung_jawab"
];

const kotaAdditional = ["user_kota.username_provinsi"];

const puskesmasAdditional = [
  "user_puskesmas_additional.username_provinsi",
  "user_puskesmas.username_provinsi"
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

const ensureOldPasswordIsCorrect = (username, password) =>
  knex("users")
    .first("username", "password")
    .where("username", username)
    .then(user => {
      if (!user) throw new errors.Unauthorized("Wrong username or password.");
      return bcrypt.compare(password, user.password);
    })
    .then(result => {
      if (!result) throw new errors.Unauthorized("Wrong username or password.");
      return Promise.resolve();
    });

module.exports = {
  listUsers: (search, page, perPage, sort) => {
    return knex("users")
      .select(userColumns.map(column => "users." + column + " as " + column))
      .search(search, userSearchableColumns.map(column => "users." + column))
      .pageAndSort(
        page,
        perPage,
        sort,
        userSortableColumns.map(column => "users." + column)
      );
  },

  searchUsers: search => {
    return knex("users")
      .select(["username"])
      .search(search, ["username"])
      .limit(20);
  },

  createUser: (user, parent) => {
    const newUser = Object.assign({}, _.pick(user, userAssignableColumns), {
      created_at: new Date(),
      updated_at: new Date()
    });

    const specificUser = Object.assign({}, _.pick(user, specificUserColumns), {
      created_at: new Date(),
      updated_at: new Date()
    });

    return knex("users")
      .first("username")
      .where("username", user.username)
      .then(existingUsers => {
        if (existingUsers) {
          throw new errors.Conflict("Username already exists.");
        }

        return bcrypt.hash(newUser.password, BCRYPT_STRENGTH);
      })
      .then(hash => {
        newUser.password = hash;
        const queries = knex("users")
          .insert(newUser)
          .then(insertedIds =>
            Object.assign(newUser, {
              password: ""
            })
          );
        if (newUser.role !== "admin" && newUser.role !== "user") {
          if (newUser.role === "provinsi") {
            return queries
              .then(userAdded => {
                return knex("user_provinsi").insert(specificUser);
              })
              .then(insertedMiddle => {
                return specificUser;
              });
          }
          if (newUser.role === "kota") {
            specificUser.username_provinsi = parent;
            return queries
              .then(userAdded => {
                return knex("user_kota").insert(specificUser);
              })
              .then(insertedMiddle => {
                return specificUser;
              });
          }
          if (newUser.role === "puskesmas") {
            specificUser.username_kota = parent;
            return queries
              .then(userAdded => {
                return knex("user_puskesmas").insert(specificUser);
              })
              .then(insertedMiddle => {
                return specificUser;
              });
          }
          specificUser.username_puskesmas = parent;
          return queries
            .then(userAdded => {
              return knex("user_kestrad").insert(specificUser);
            })
            .then(insertedMiddle => {
              return specificUser;
            });
        }
        return queries;
      });
  },

  getUser: username => {
    let promises = Promise.resolve();
    promises = promises.then(() => {
      return knex("users")
        .first("role")
        .where("username", username)
        .then(result => result.role);
    });

    return promises.then(role => {
      if (role === "provinsi") {
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
          .where("users.username", username);
      }
      if (role === "kota") {
        return knex("users")
          .first(getKotaTable)
          .innerJoin("user_kota", "users.username", "user_kota.username")
          .innerJoin(
            "user_kota_additional",
            "users.username",
            "user_kota_additional.username"
          )
          .where("users.username", username);
      }
      if (role === "puskesmas") {
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
          .where("users.username", username);
      }
      if (role === "kestrad") {
        return knex("users")
          .first(getKestradTable)
          .innerJoin("user_kestrad", "users.username", "user_kestrad.username")
          .innerJoin(
            "user_kestrad_additional",
            "users.username",
            "user_kestrad_additional.username"
          )
          .where("users.username", username);
      }
      return knex("users")
        .first(userColumns)
        .where("username", username);
    });
  },

  updateUser: (
    username,
    userUpdates,
    requireOldPasswordCheck = true,
    oldPassword = ""
  ) => {
    let promises = Promise.resolve();

    if (userUpdates.password) {
      if (requireOldPasswordCheck) {
        promises = promises.then(() => {
          return ensureOldPasswordIsCorrect(username, oldPassword);
        });
      }

      promises = promises.then(() => {
        return bcrypt.hash(userUpdates.password, BCRYPT_STRENGTH);
      });
    }

    userUpdates = _.pick(userUpdates, userAssignableColumns);
    userUpdates.updated_at = new Date();
    return promises.then(hash => {
      userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
      return knex("users")
        .update(userUpdates)
        .where("username", username);
    });
  },

  deleteUser: username => {
    return knex("users")
      .first("role")
      .where("username", username)
      .then(result => {
        const { role } = result;

        if (role === "provinsi") {
          return knex("user_provinsi")
            .delete()
            .where("username", username);
        }
        if (role === "kota") {
          return knex("user_kota")
            .delete()
            .where("username", username);
        }
        if (role === "puskesmas") {
          return knex("user_puskesmas")
            .delete()
            .where("username", username);
        }
        return knex("user_kestrad")
          .delete()
          .where("username", username);
      })
      .then(affectedRowCount => {
        return knex("users")
          .where("username", username)
          .delete()
          .then(affectedRow => affectedRow + affectedRowCount);
      });
  },

  resetPassword: (userUpdates, username, usernameChanger, changerRole) => {
    if (!userUpdates.password) throw new errors.UnprocessableEntity();

    const promises = bcrypt.hash(userUpdates.password, BCRYPT_STRENGTH);

    const promises2 = knex("users")
      .first("role")
      .where("username", username)
      .then(row => row.role);

    if (changerRole === "admin") {
      return promises.then(hash => {
        userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
        return knex("users")
          .update(userUpdates)
          .where("username", username);
      });
    }
    if (changerRole === "provinsi") {
      return promises.then(hash => {
        userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
        return promises2.then(role => {
          if (role !== "kota") {
            throw new errors.Forbidden();
          }

          return knex("user_kota")
            .first("username_provinsi")
            .where("username_provinsi", usernameChanger)
            .andWhere("username", username)
            .then(provinsi => {
              if (!provinsi) {
                throw new errors.Forbidden();
              }

              return knex("users")
                .where("username", username)
                .update(userUpdates);
            });
        });
      });
    }
    if (changerRole === "kota") {
      return promises.then(hash => {
        userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
        return promises2.then(role => {
          if (role !== "puskesmas") {
            throw new errors.Forbidden();
          }

          return knex("user_puskesmas")
            .select("username_kota")
            .where("username_kota", usernameChanger)
            .andWhere("username", username)
            .first()
            .then(kota => {
              if (!kota) {
                throw new errors.Forbidden();
              }

              return knex("users")
                .where("username", username)
                .update(userUpdates);
            });
        });
      });
    }
    return promises.then(hash => {
      userUpdates.password = hash; // If hash is not computed, will result in undefined, which will be ignored.
      return promises2.then(role => {
        if (role !== "kestrad") {
          throw new errors.Forbidden();
        }

        return knex("user_kestrad")
          .first("username_puskesmas")
          .where("username_puskesmas", usernameChanger)
          .andWhere("username", username)
          .then(puskesmas => {
            if (!puskesmas) {
              throw new errors.Forbidden();
            }

            return knex("users")
              .where("username", username)
              .update(userUpdates);
          });
      });
    });
  }
};
