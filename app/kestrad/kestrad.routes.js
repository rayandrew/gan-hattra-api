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

const isOwnerOrPuskesmas = auth.createMiddlewareFromPredicate(
  (user, req) => {
    return (
      user.username === req.params.username ||
      auth.predicates.isPuskesmas(user)
    );
  }
);

/** custom username generator */
const usernameGenerator = (pred, name) => {
  const nameArr = name.split(' ').map(val => val.toLowerCase());
  return (pred + '_' + nameArr.join('')).substring(0, 255);
};


/**
 * Get a list of kestrad.
 * @name Get kestrad
 * @route {GET} /kestrad
 */
router.get(
  '/kestrad',
  auth.middleware.isPuskesmasOrHigher,
  validators.listKestrad,
  (req, res, next) => {
    const isAdmin = auth.predicates.isAdmin(req.user);
    if (isAdmin) {
      return queries
        .listKestrad(
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
        .listKestradByProvinsi(
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
        .listKestradByKota(
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
        .listKestradByPuskesmas(
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
 * Get a list of kestrad for searching.
 * @name Search kestrad
 * @route {GET} /kestrad/search
 */
router.get('/kestrad/search', auth.middleware.isLoggedIn, (req, res, next) => {
  return queries
    .searchKestrad(
      req.query.search,
      req.query.page,
      req.query.perPage,
      req.query.sort)
    .then(result => {
      return res.json(result);
    })
    .catch(next);
});

/**
 * Get specific kestrad information for the specified username.
 * @name Get kestrad info.
 * @route {GET} /kestrad/:username
 */
router.get(
  '/kestrad/:username',
  isOwnerOrPuskesmasAndHigher,
  (req, res, next) => {
    return queries
      .getSpecificKestrad(req.params.username)
      .then(user => {
        if (!user) return next(new errors.NotFound('User not found.'));
        return res.json(user);
      })
      .catch(next);
  }
);


/**
 * Updates kestrad information for the given username.
 * @name Update kestrad
 * @route {PATCH} /kestrad/:username
 */
router.patch(
  '/kestrad/:username',
  isOwnerOrPuskesmas,
  validators.updateKestrad,
  (req, res, next) => {
    let kestradUpdates = {
      kecamatan: req.body.kecamatan,
      nama: req.body.nama,
      kepala_dinas: req.body.kepala_dinas,
      alamat: req.body.alamat
    };

    return queries
      .updateKestrad(req.params.username, kestradUpdates, req.user.username)
      .then(affectedRowCount => {
        return res.json({ affectedRowCount: affectedRowCount });
      })
      .catch(next);
  }
);

/**
 * Add a new layanan.
 * @name Create layanan
 * @route {POST} /kestrad/addLayanan
 */
router.post(
  '/kestrad/addLayanan',
  auth.middleware.isPuskesmas,
  validators.createLayanan,
  (req, res, next) => {
    let insertLayanan = {
      username_kestrad: req.body.username_kestrad,
      id_subkategori: req.body.id_subkategori,
      nama_layanan: req.body.nama_layanan,
      verified : 'awaiting_validation'
    };

    return queries
      .addLayanan(insertLayanan)
      .then(layanan => {
        return res.json({id_layanan : layanan[0]});
      })
      .catch(next);
  }
);

/**
 * Add a new hattra.
 * @name Create layanan
 * @route {POST} /kestrad/addHattra
 */
router.post(
  '/kestrad/addHattra',
  auth.middleware.isPuskesmas,
  validators.createHattra,
  (req, res, next) => {
    let insertHattra = {
      id_layanan: req.body.id_layanan,
      nama: req.body.nama,
      ijin_hattra: req.body.ijin_hattra,
      verified: 'awaiting_validation'
    };

    return queries
      .addHattra(insertHattra)
      .then(hattra => {
        return res.json({ hattra: hattra[0]});
      })
      .catch(next);
  }
);


module.exports = router;
