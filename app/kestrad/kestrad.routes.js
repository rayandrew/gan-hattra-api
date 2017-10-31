'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const validators = require('./kestrad.validators.js');
const errors = require('http-errors');
const queries = require('./kestrad.queries.js');
const config = require('config');
const router = express.Router();

/** Custom auth middleware that checks whether the accessing kestrad is this kestrad's owner or a supervisor. */
const isOwnerOrPuskesmasAndHigher = auth.createMiddlewareFromPredicate((user, req) => {
    return (user.username === req.params.username) || auth.predicates.isPuskesmasOrHigher(user);
});

/** Custom auth middleware that checks whether the accessing kestrad is this kestrad's owner or a supervisor. */
const isOwnerOrKestradAndHigher = auth.createMiddlewareFromPredicate((user, req) => {
    return (user.username === req.params.username) || auth.predicates.isKestradOrHigher(user);
});

/** custom username generator */
const usernameGenerator = (pred, name) => {
    const nameArr = name.split(' ').map(val => val.toLowerCase());
    return (pred + '_' + nameArr.join('')).substring(0, 255);
}

/**
 * Get a list of kestrad.
 * @name Get kestrad
 * @route {GET} /kestrad
 */
router.get('/kestrad', auth.middleware.isPuskesmasOrHigher, validators.listKestrad, (req, res, next) => {
    const isAdmin = auth.predicates.isAdmin(req.user);
    if (isAdmin) {
        return queries.listKestrad(req.query.search, req.query.page, req.query.perPage, req.query.sort)
            .then((kestrad) => {
                return res.json(kestrad);
            })
            .catch(next);
    } else if (auth.predicates.isProvinsi(req.user)) {
        return queries.getKestradForProvinsi(req.user.username)
            .then((kestrad) => {
                if (!kestrad) return next(new errors.NotFound('Kestrad not found'));
                return res.json(kestrad);
            })
            .catch(next);
    } else if (auth.predicates.isKota(req.user)) {
        return queries.getKestradForKota(req.user.username)
            .then((kestrad) => {
                if (!kestrad) return next(new errors.NotFound('Kestrad not found'));
                return res.json(kestrad);
            })
            .catch(next);
    } else {
        return queries.getKestradForPuskesmas(req.user.username)
            .then((kestrad) => {
                if (!kestrad) return next(new errors.NotFound('Kestrad not found'));
                return res.json(kestrad);
            })
            .catch(next);
    }
});

/**
 * Get a list of kestrad for searching.
 * @name Search kestrad
 * @route {GET} /kestrad/search
 */
router.get('/kestrad/search', auth.middleware.isLoggedIn, (req, res, next) => {
    return queries.searchKestrad(req.query.search)
        .then((result) => {
            return res.json(result);
        })
        .catch(next);
});

/**
 * Get specific kestrad information for the specified username.
 * @name Get kestrad info.
 * @route {GET} /kestrad/:username
 */
router.get('/kestrad/:username', isOwnerOrPuskesmasAndHigher, (req, res, next) => {
    return queries.getSpecificKestrad(req.params.username)
        .then((user) => {
            if (!user) return next(new errors.NotFound('User not found.'));
            return res.json(user);
        })
        .catch(next);
});

/**
 * Updates kestrad information for the given username.
 * @name Update kestrad
 * @route {PATCH} /kestrad/:username
 */
router.patch('/kestrad/:username', isOwnerOrPuskesmasAndHigher, validators.updateKestrad, (req, res, next) => {
    let kestradUpdates = {
        nama_kota: req.body.nama_kota,
        nama: req.body.nama,
        kepala_dinas: req.body.kepala_dinas,
        alamat: req.body.alamat
    };

    return queries.updateKestrad(req.params.username, userUpdates)
        .then((affectedRowCount) => {
            return res.json({ affectedRowCount: affectedRowCount });
        })
        .catch(next);
});

/**
 * Updates kestrad verification for the given username.
 * @name Update kestrad verification
 * @route {PATCH} /kestrad/verification/:username
 */
router.patch('/kestrad/verification/:username', isOwnerOrPuskesmasAndHigher, validators.updateKestrad, (req, res, next) => {
    let kestradUpdates = {
        verified: req.kestrad.verified,
        tanggal_verifikasi: req.kestrad.tanggal_verifikasi
    };

    if (req.body.verification) {
        return queries.updateKestrad(req.params.username, userUpdates)
            .then((affectedRowCount) => {
                return res.json({ affectedRowCount: affectedRowCount });
            })
            .catch(next);
    } else {
        return next(new errors('Kestrad verification unauthorized'));
    }
});

module.exports = router;