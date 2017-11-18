'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const validators = require('./puskesmas.validators.js');
const errors = require('http-errors');
const queries = require('./puskesmas.queries.js');
const config = require('config');
const router = express.Router();

/** Custom auth middleware that checks whether the accessing puskesmas is this puskesmas's owner or a supervisor. */
const isOwnerOrKotaAndHigher = auth.createMiddlewareFromPredicate(
  (user, req) => {
    return (
      user.username === req.params.username ||
      auth.predicates.isKotaOrHigher(user)
    );
  }
);

/** custom username generator */
const usernameGenerator = (pred, name) => {
  const nameArr = name.split(' ').map(val => val.toLowerCase());
  return (pred + '_' + nameArr.join('')).substring(0, 255);
};

/**
 * Get a list of puskesmas.
 * @name Get puskesmas
 * @route {GET} /puskesmas
 */
router.get(
  '/puskesmas',
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
    } else if (auth.predicates.isProvinsi(req.user)) {
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
    } else {
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
  }
);

/**
 * Get a list of puskesmas for searching.
 * @name Search puskesmas
 * @route {GET} /puskesmas/search
 */
router.get(
  '/puskesmas/search',
  auth.middleware.isKotaOrHigher,
  (req, res, next) => {
    return queries
      .searchPuskesmas(req.query.search,
        req.query.page,
        req.query.perPage,
        req.query.sort)
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
router.get('/puskesmas/:username', isOwnerOrKotaAndHigher, (req, res, next) => {
  return queries
    .getSpecificPuskesmas(req.params.username)
    .then(user => {
      if (!user) return next(new errors.NotFound('User not found.'));
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
  '/puskesmas/:username',
  isOwnerOrKotaAndHigher,
  validators.updatePuskesmas,
  (req, res, next) => {
    let puskesmasUpdates = {
      nama: req.body.nama,
      kepala_dinas: req.body.kepala_dinas,
      alamat: req.body.alamat
    };
    const isAdmin = auth.predicates.isAdmin(req.user);
    if(isAdmin || (req.params.username == req.user.username)) {
      return queries
        .updatePuskesmas(req.params.username, puskesmasUpdates)
        .then(affectedRowCount => {
          return res.json({ affectedRowCount: affectedRowCount });
        })
        .catch(next);
    } else {
      return queries
      .updatePuskesmasForKota(req.params.username, puskesmasUpdates, req.user.username)
      .then(affectedRowCount => {
        return res.json({ affectedRowCount: affectedRowCount });
      })
      .catch(next);
    }
  }
);

module.exports = router;
