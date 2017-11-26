'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const validators = require('./layanan.validators.js');
const errors = require('http-errors');
const queries = require('./layanan.queries.js');
const config = require('config');
const router = express.Router();

/** Custom auth middleware that checks whether the accessing layanan is this layanan's owner or a supervisor. */
const isOwnerOrKestradAndHigher = auth.createMiddlewareFromPredicate(
  (user, req) => {
    return (
      user.username === req.params.username ||
      auth.predicates.isKestradOrHigher(user)
    );
  }
);

/** custom username generator */
const usernameGenerator = (pred, name) => {
  const nameArr = name.split(' ').map(val => val.toLowerCase());
  return (pred + '_' + nameArr.join('')).substring(0, 255);
};

/**
 * Get a list of layanan.
 * @name Get layanan
 * @route {GET} /layanan
 */
router.get(
  '/layanan',
  auth.middleware.isKestradOrHigher,
  validators.listLayanan,
  (req, res, next) => {
    const isAdmin = auth.predicates.isAdmin(req.user);
    if (isAdmin) {
      return queries
        .listLayanan(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort
        )
        .then(layanan => {
          return res.json(layanan);
        })
        .catch(next);
    } else if (auth.predicates.isProvinsi(req.user)) {
      return queries
        .getLayananForProvinsi(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort,
          req.user.username
        )
        .then(layanan => {
          if (!layanan) {
            return next(new errors.NotFound('layanan not found'));
          }
          return res.json(layanan);
        })
        .catch(next);
    } else if (auth.predicates.isKota(req.user)) {
      return queries
        .getLayananForKota(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort,
          req.user.username
        )
        .then(layanan => {
          if (!layanan) {
            return next(new errors.NotFound('layanan not found'));
          }
          return res.json(layanan);
        })
        .catch(next);
    } else if (auth.predicates.isPuskesmas(req.user)) {
      return queries
        .getLayananForPuskesmas(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort,
          req.user.username
        )
        .then(layanan => {
          if (!layanan) {
            return next(new errors.NotFound('layanan not found'));
          }
          return res.json(layanan);
        })
        .catch(next);
    } else {
      // isKestrad
      return queries
        .getLayananForKestrad(
          req.query.search,
          req.query.page,
          req.query.perPage,
          req.query.sort,
          req.user.username
        )
        .then(layanan => {
          if (!layanan) {
            return next(new errors.NotFound('layanan not found'));
          }
          return res.json(layanan);
        })
        .catch(next);
    }
  }
);

/**
 * Get a list of layanan predecessor username.
 * @name Get hattra
 * @route {GET} /hattra
 */
router.get(
  '/layanan/byUser/:username',
  auth.middleware.isKestradOrHigher,
  (req, res, next) => {
    return queries
      .listLayananByUsername(
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
 * Get a list of layanan for searching.
 * @name Search layanan
 * @route {GET} /layanan/search
 */
router.get('/layanan/search', auth.middleware.isLoggedIn, (req, res, next) => {
  return queries
    .searchLayanan(
      req.query.search,
      req.query.page,
      req.query.perPage,
      req.query.sort
    )
    .then(result => {
      return res.json(result);
    })
    .catch(next);
});

/**
 * Get a list of kategori
 * @name Get kategori
 * @route {GET} /layanan/listKategori
 */
router.get(
  '/layanan/listKategori',
  auth.middleware.isKestradOrHigher,
  validators.listLayanan,
  (req, res, next) => {
    return queries
      .listKategori(
        req.query.search,
        req.query.page,
        req.query.perPage,
        req.query.sort
      )
      .then(kategori => {
        return res.json(kategori);
      })
      .catch(next);
  }
);

/**
 * Get a list of subkategori
 * @name Get subkategori
 * @route {GET} /layanan/listSubkategori
 */
router.get(
  '/layanan/listSubkategori',
  auth.middleware.isKestradOrHigher,
  validators.listLayanan,
  (req, res, next) => {
    return queries
      .listSubKategori(
        req.query.search,
        req.query.page,
        req.query.perPage,
        req.query.sort
      )
      .then(subkategori => {
        return res.json(subkategori);
      })
      .catch(next);
  }
);

/**
 * Get specific layanan information for the specified nama.
 * @name Get layanan info.
 * @route {GET} /layanan/:nama
 */
router.get('/layanan/:id', isOwnerOrKestradAndHigher, (req, res, next) => {
  return queries
    .getSpecificLayanan(req.params.id)
    .then(user => {
      if (!user) return next(new errors.NotFound('Layanan not found.'));
      return res.json(user);
    })
    .catch(next);
});

/**
 * Updates layanan information for the given id_layanan.
 * @name Update layanan
 * @route {PATCH} /layanan/:nama
 */
router.patch(
  '/layanan/:id_layanan',
  auth.middleware.isPuskesmas,
  validators.updateNamaLayanan,
  (req, res, next) => {
    let layananUpdates = {
      nama_layanan: req.body.nama_layanan
    };

    return queries
      .updateNamaLayanan(
        req.params.id_layanan,
        layananUpdates,
        req.user.username
      )
      .then(affectedRowCount => {
        return res.json({ affectedRowCount: affectedRowCount });
      })
      .catch(next);
  }
);

/**
 * Updates verification information for the given id_layanan.
 * @name Update layanan
 * @route {PATCH} /layanan/:id_layanan
 */
router.patch(
  '/layanan/verifikasi/:id_layanan',
  auth.middleware.isKota,
  validators.updateVerifikasiLayanan,
  (req, res, next) => {
    let layananUpdates = {
      verified: req.body.verified
    };

    return queries
      .updateVerifikasiLayanan(
        req.params.id_layanan,
        layananUpdates,
        req.user.username
      )
      .then(affectedRowCount => {
        return res.json({ affectedRowCount: affectedRowCount });
      })
      .catch(next);
  }
);

module.exports = router;
