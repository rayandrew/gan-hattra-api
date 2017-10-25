'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const validators = require('./puskesmas.validators.js');
const validatorUser = require('../users/users.validators.js');
const errors = require('http-errors');
const queries = require('./puskesmas.queries.js');
const config = require('config');
const router = express.Router();

/** Custom auth middleware that checks whether the accessing user is this user's owner or a supervisor. */
const isOwnerOrKotaAndHigher = auth.createMiddlewareFromPredicate((user, req) => {
    return (user.username === req.params.username) || auth.predicates.isKotaOrHigher(user);
});

/** custom username generator */
const usernameGenerator = (pred, name) => {
    const nameArr = name.split(' ').map(val => val.toLowerCase());
    return (pred + '_' + nameArr.join('')).substring(0, 255);
}

/**
 * Get a list of users.
 * @name Get users
 * @route {GET} /users
 */
router.get('/puskesmas', validators.listPuskesmas, auth.middleware.isKotaOrHigher, (req, res, next) => {
    const isAdmin = auth.predicates.isAdmin(req.user);
    if (isAdmin) {
        return queries.listPuskesnas(req.query.search, req.query.page, req.query.perPage, req.query.sort)
            .then((puskesmas) => {
                return res.json(puskesmas);
            })
            .catch(next);
    } else if (auth.predicates.isProvinsi(req.user)) {
        return queries.getPuskesmasForProvinsi(req.user.username)
            .then((puskesmas) => {
                if (!puskesmas) return next(new errors.NotFound('Puskesmas not found'));
                return res.json(puskesmas);
            })
            .catch(next);
    } else {
        return queries.getPuskesmasForKota(req.user.username)
            .then((puskesmas) => {
                if (!puskesmas) return next(new errors.NotFound('Puskesmas not found'));
                return res.json(puskesmas);
            })
            .catch(next);
    }
});

/**
 * Get a list of users for searching.
 * @name Search users
 * @route {GET} /users
 */
router.get('/puskesmas/search', auth.middleware.isLoggedIn, (req, res, next) => {
    return queries.searchPuskesmas(req.query.search, req.query.category)
        .then((result) => {
            return res.json(result);
        })
        .catch(next);
});

/**
 * Get specific user information for the specified username.
 * @name Get user info.
 * @route {GET} /users/:username
 */
router.get('/puskesmas/:username', isOwnerOrKotaAndHigher, (req, res, next) => {
    return queries.getSpesificPuskesmas(req.params.username)
        .then((user) => {
            if (!user) return next(new errors.NotFound('User not found.'));
            return res.json(user);
        })
        .catch(next);
});

/**
 * Updates user information for the given username.
 * @name Update user
 * @route {PATCH} /users/:username
 */
router.patch('/puskesmas/:username', validators.updatePuskesmas, isOwnerOrKotaAndHigher, (req, res, next) => {
    let puskesmasUpdates = {
        nama_kota: req.body.nama_kota,
        nama: req.body.nama,
        nama_dinas: req.body.nama_dinas,
        kepala_dinas: req.body.kepala_dinas,
        alamat: req.body.alamat
    };

    return queries.updatePuskesmas(req.params.username, userUpdates)
        .then((affectedRowCount) => {
            return res.json({ affectedRowCount: affectedRowCount });
        })
        .catch(next);
});

/**
 * Delete the specified user.
 * @name Delete user
 * @route {DELETE} /users/:username
 */
router.delete('/puskesmas/:username', isOwnerOrKotaAndHigher, (req, res, next) => {
    return queries.deletePuskesmas(req.params.username)
        .then((affectedRowCount) => {
            return res.json({ affectedRowCount: affectedRowCount });
        })
        .catch(next);
});

module.exports = router;