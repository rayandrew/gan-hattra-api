'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const validators = require('./kota.validators.js');
const errors = require('http-errors');
const queries = require('./kota.queries.js');
const config = require('config');
const router = express.Router();

/** Custom auth middleware that checks whether the accessing user is this user or (provinsi and higher). */
const isOwnerOrProvinsiAndHigher = auth.createMiddlewareFromPredicate(
  (user, req) => {
    return (
      user.username === req.params.username ||
      auth.predicates.isProvinsiOrHigher(user)
    );
  }
);

/**
 * Get all kota information
 * @name Get all kota
 * @route {GET} /kota
 */
router.get(
  '/kota',
  auth.middleware.isProvinsiOrHigher,
  validators.listKota,
  (req, res, next) => {
    const isAdmin = auth.predicates.isAdmin(req.user);
    if (isAdmin) {
      return queries
        .listKota(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort
        )
        .then(kota => {
          return res.json(kota);
        })
        .catch(next);
    } else {
      return queries
        .getKotaForProvinsi(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort,
          req.user.username
        )
        .then(kota => {
          if (!kota) return next(new errors.NotFound('Kota not found'));
          return res.json(kota);
        })
        .catch(next);
    }
  }
);

/**
 * Get a list of kota for searching.
 * @name Search users
 * @route {GET} /users/search
 */
router.get(
  '/kota/search',
  auth.middleware.isProvinsiOrHigher,
  (req, res, next) => {
    return queries
      .searchUsers(
        req.query.search,
        req.query.page,
        req.query.perPage,
        req.query.sort,
        req.user.username
      )
      .then(result => {
        return res.json(result);
      })
      .catch(next);
  }
);

/**
 * Get a specific kota information for the specific kota.
 * @name Get kota info
 * @route {GET} /kota/:username
 */
router.get('/kota/:username', isOwnerOrProvinsiAndHigher, (req, res, next) => {
  return queries
    .getSpecificKota(req.params.username)
    .then(kota => {
      if (!kota) return next(new errors.NotFound('Kota not found.'));
      return res.json(kota);
    })
    .catch(next);
});

/**
 * Update kota information for the given username
 * @name Update kota
 * @route {PATCH} /kota/:username
 */
router.patch(
  '/kota/:username',
  isOwnerOrProvinsiAndHigher,
  (req, res, next) => {
    let kotaUpdates = {
      nama: req.body.nama,
      nama_dinas: req.body.nama_dinas,
      kepala_dinas: req.body.kepala_dinas,
      alamat: req.body.alamat
    };
    return queries
      .updateKota(req.params.username, kotaUpdates)
      .then(affectedRowCount => {
        return res.json({ affectedRowCount: affectedRowCount });
      })
      .catch(next);
  }
);

module.exports = router;
