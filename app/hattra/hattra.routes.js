'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const validators = require('./kestrad.validators.js');
const errors = require('http-errors');
const queries = require('./kestrad.queries.js');
const config = require('config');
const router = express.Router();

/** Custom auth middleware that checks whether the accessing kestrad is this kestrad's owner or a supervisor. */
const isOwnerOrPuskesmasAndHigher = auth.createMiddlewareFromPredicate(
  (user, req) => {
    return (
      user.username === req.params.username ||
      auth.predicates.isPuskesmasOrHigher(user)
    );
  }
);

/** Custom auth middleware that checks whether the accessing kestrad is this kestrad's owner or a supervisor. */
const isOwnerOrKestradAndHigher = auth.createMiddlewareFromPredicate(
  (user, req) => {
    return (
      user.username === req.params.username ||
      auth.predicates.isKestradOrHigher(user)
    );
  }
);

/**
 * Get a list of hattra.
 * @name Get hattra
 * @route {GET} /hattra
 */
router.get(
  '/hattra',
  auth.middleware.isPuskesmasOrHigher,
  validators.listKestrad,
  (req, res, next) => {
    const isAdmin = auth.predicates.isAdmin(req.user);
    if (isAdmin) {
      return queries
        .listHattra(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort
        )
        .then(kestrad => {
          return res.json(kestrad);
        })
        .catch(next);
    } else if (auth.predicates.isProvinsi(req.user)) {
      return queries
        .listHattraByProvinsi(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort,
          req.user.username
        )
        .then(kestrad => {
          return res.json(kestrad);
        })
        .catch(next);
    } else if (auth.predicates.isKota(req.user)) {
      return queries
        .listHattraByKota(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort,
          req.user.username
        )
        .then(kestrad => {
          return res.json(kestrad);
        })
        .catch(next);
    } else if (auth.predicates.isPuskesmas(req.user)) {
      return queries
        .listHattraByPuskesmas(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort,
          req.user.username
        )
        .then(kestrad => {
          return res.json(kestrad);
        })
        .catch(next);
    } else {
      return queries
        .listHattraByKestrad(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort,
          req.user.username
        )
        .then(kestrad => {
          return res.json(kestrad);
        })
        .catch(next);
    }
  }
);

/**
 * Get a list of hattra for searching.
 * @name Search hattra
 * @route {GET} /hattra/search
 */
router.get('/hattra/search', auth.middleware.isLoggedIn, (req, res, next) => {
  return queries
    .searchHattra(req.query.search)
    .then(result => {
      return res.json(result);
    })
    .catch(next);
});

/**
 * Get specific hattra information for the specified id.
 * @name Get hattra info.
 * @route {GET} /hattra/:id
 */
router.get(
  '/hattra/:id',
  isOwnerOrKestradAndHigher,
  (req, res, next) => {
    return queries
      .getSpecificHattra(req.params.id)
      .then(user => {
        if (!user) return next(new errors.NotFound('id not found.'));
        return res.json(user);
      })
      .catch(next);
  }
);

/**
 * Updates hattra information for the given id.
 * @name Update hattra
 * @route {PATCH} /hattra/:id
 */
router.patch(
  '/hattra/:id',
  isOwnerOrKestradAndHigher,
  validators.updateHattra,
  (req, res, next) => {
    let hattraUpdates = {
      id_hattra: req.body.id_hattra,
      id_layanan: req.body.id_layanan,
      nama: req.body.nama,
      ijin_hattra: req.body.ijin_hattra,
      verified: req.body.verified
    };

    return queries
      .updateHattra(req.params.id, hattraUpdates)
      .then(affectedRowCount => {
        return res.json({ affectedRowCount: affectedRowCount });
      })
      .catch(next);
  }
);

/**
 * Updates hattra verification for the given id.
 * @name Update hattra verification
 * @route {PATCH} /hattra/:id/verification
 */
router.patch(
  '/hattra/:id/verification',
  isOwnerOrPuskesmasAndHigher,
  validators.updateHattra,
  (req, res, next) => {
    let hattraUpdates = {
      verified: req.body.layanan.verified,
    };

    if (req.body.verification) {
      return queries
        .updateHattra(req.params.username, layananUpdates)
        .then(affectedRowCount => {
          return res.json({ affectedRowCount: affectedRowCount });
        })
        .catch(next);
    } else {
      return next(new errors('hattra verification unauthorized'));
    }
  }
);

module.exports = router;
