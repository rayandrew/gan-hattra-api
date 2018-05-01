"use strict";

const express = require("express");
const errors = require("http-errors");
const auth = require("../components/auth.js");
const validators = require("./provinsi.validators.js");
const queries = require("./provinsi.queries.js");

const router = express.Router();

/** Custom auth middleware that checks whether the accessing user is this user's owner or a supervisor. */
const isUserProvinsiOrHigher = auth.createMiddlewareFromPredicate(
  (user, req) => {
    return (
      user.username === req.params.username ||
      auth.predicates.isAdmin(user) ||
      auth.predicates.isProvinsi(user)
    );
  }
);

const isOwnerOrAdmin = auth.createMiddlewareFromPredicate((user, req) => {
  return user.username === req.params.username || auth.predicates.isAdmin(user);
});

/**
 * Get a list of provinsi for searching.
 * @name Search provinsi
 * @route {GET} /provinsi
 */
router.get(
  "/provinsi/search",
  auth.middleware.isLoggedIn,
  isUserProvinsiOrHigher,
  (req, res, next) => {
    return queries
      .searchProvinsi(
        req.query.search,
        req.query.page,
        req.query.perPage,
        req.query.sort
      )
      .then(result => {
        return res.json(result);
      })
      .catch(next);
  }
);

/**
 * Get a list of provinsi.
 * @name Get provinsi
 * @route {GET} /provinsi
 */
router.get(
  "/provinsi",
  isUserProvinsiOrHigher,
  validators.listProvinsi,
  (req, res, next) => {
    const isAdmin = auth.predicates.isAdmin(req.user);
    if (isAdmin) {
      return queries
        .listProvinsi(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort
        )
        .then(result => {
          return res.json(result);
        })
        .catch(next);
    }
    return queries
      .getProvinsi(req.user.username)
      .then(result => {
        if (!result) return next(new errors.NotFound("User not found."));
        return res.json(result);
      })
      .catch(next);
  }
);

/**
 * Get specific provinsi for the specified username.
 * @name Get provinsi info.
 * @route {GET} /provinsi/:username
 */
router.get("/provinsi/:username", isUserProvinsiOrHigher, (req, res, next) => {
  return queries
    .getProvinsi(req.params.username)
    .then(user => {
      if (!user) return next(new errors.NotFound("User not found."));
      return res.json(user);
    })
    .catch(next);
});

/**
 * Updates user information for the given username.
 * @name Update user
 * @route {PATCH} /provinsi/:username
 */
router.patch(
  "/provinsi/:username",
  isOwnerOrAdmin,
  validators.updateProvinsi,
  (req, res, next) => {
    const userUpdates = {
      nama: req.body.nama,
      kepala_dinas: req.body.kepala_dinas,
      alamat: req.body.alamat
    };

    return queries
      .updateProvinsi(req.params.username, userUpdates)
      .then(affectedRowCount => {
        return res.json({ affectedRowCount });
      })
      .catch(next);
  }
);

module.exports = router;
