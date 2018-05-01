"use strict";

const express = require("express");
const errors = require("http-errors");
const auth = require("../components/auth.js");
const validators = require("./puskesmas.validators.js");
const queries = require("./puskesmas.queries.js");

const router = express.Router();

/** Custom auth middleware that checks whether the accessing puskesmas is this puskesmas's owner or a supervisor. */
const isOwnerOrAdmin = auth.createMiddlewareFromPredicate((user, req) => {
  return user.username === req.params.username || auth.predicates.isAdmin(user);
});

const isOwnerOrKotaAndHigher = auth.createMiddlewareFromPredicate(
  (user, req) => {
    return (
      user.username === req.params.username ||
      auth.predicates.isKotaOrHigher(user)
    );
  }
);

/**
 * Get a list of puskesmas.
 * @name Get puskesmas
 * @route {GET} /puskesmas
 */
router.get(
  "/puskesmas",
  auth.middleware.isKotaOrHigher,
  validators.listPuskesmas,
  (req, res, next) => {
    const isAdmin = auth.predicates.isAdmin(req.user);
    if (isAdmin) {
      return queries
        .listPuskesmas(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort
        )
        .then(puskesmas => {
          return res.json(puskesmas);
        })
        .catch(next);
    }
    if (auth.predicates.isProvinsi(req.user)) {
      return queries
        .getPuskesmasForProvinsi(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort,
          req.user.username
        )
        .then(puskesmas => {
          return res.json(puskesmas);
        })
        .catch(next);
    }
    return queries
      .getPuskesmasForKota(
        req.query.search,
        req.query.page,
        req.query.perPage,
        req.query.sort,
        req.user.username
      )
      .then(puskesmas => {
        return res.json(puskesmas);
      })
      .catch(next);
  }
);

/**
 * Get a list of puskesmas predecessor username.
 * @name Get hattra
 * @route {GET} /hattra
 */
router.get(
  "/puskesmas/byUser/:username",
  auth.middleware.isPuskesmasOrHigher,
  (req, res, next) => {
    return queries
      .listPuskesmasByUsername(
        req.query.search,
        req.query.page,
        req.query.perPage,
        req.query.sort,
        req.user.username,
        req.user.role,
        req.params.username
      )
      .then(result => {
        return res.json(result);
      })
      .catch(next);
  }
);

/**
 * Get a list of puskesmas for searching.
 * @name Search puskesmas
 * @route {GET} /puskesmas/search
 */
router.get(
  "/puskesmas/search",
  auth.middleware.isKotaOrHigher,
  (req, res, next) => {
    return queries
      .searchPuskesmas(
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
 * Get specific puskesmas information for the specified username.
 * @name Get puskesmas info.
 * @route {GET} /puskesmas/:username
 */
router.get("/puskesmas/:username", isOwnerOrKotaAndHigher, (req, res, next) => {
  return queries
    .getSpecificPuskesmas(req.params.username)
    .then(user => {
      if (!user) return next(new errors.NotFound("User not found."));
      return res.json(user);
    })
    .catch(next);
});

/**
 * Updates puskesmas information for the given username.
 * @name Update puskesmas
 * @route {PATCH} /puskesmas/:username
 */
router.patch(
  "/puskesmas/:username",
  isOwnerOrAdmin,
  validators.updatePuskesmas,
  (req, res, next) => {
    const puskesmasUpdates = {
      nama: req.body.nama,
      kepala_dinas: req.body.kepala_dinas,
      alamat: req.body.alamat
    };
    return queries
      .updatePuskesmas(req.params.username, puskesmasUpdates)
      .then(affectedRowCount => {
        return res.json({ affectedRowCount });
      })
      .catch(next);
  }
);

module.exports = router;
