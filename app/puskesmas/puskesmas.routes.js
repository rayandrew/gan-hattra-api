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
const isOwnerOrSupervisor = auth.createMiddlewareFromPredicate((user, req) => {
    return (user.username === req.params.username) || auth.predicates.isSupervisor(user);
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
router.get('/puskesmas', validators.listPuskesmas, (req, res, next) => {
    return queries.listPuskesmas(req.query.search, req.query.page, req.query.perPage, req.query.sort)
        .then((result) => {
            return res.json(result);
        })
        .catch(next);
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
 * Creates a new user.
 * @name Create user
 * @route {POST} /users
 */
router.post('/puskesmas', validatorUser.createUser, (req, res, next) => { // TODO: email/captcha validation
    const publicPuskesmasRegistration = config.get('publicUserRegistration');
    const isAdmin = auth.predicates.isAdmin(req.user);

    if (!isAdmin && !publicUserRegistration) return next(new errors.Forbidden());

    req.body.status = 'active';

    if (auth.predicates.isPuskesmas(req.user)) {
        if (!req.body.username) req.body.username = usernameGenerator('kestrad', req.body.nama);
        req.body.role = 'kestrad';
    } else {
        req.body.role = 'user';
        req.body.status = 'awaiting_validation';
    }

    if (!req.body.password) req.body.password = req.body.username;

    return queries.createPuskesmas(req.body)
        .then((insertedUser) => {
            return res.status(201).json(insertedUser);
        })
        .catch(next);
});

/**
 * Get specific user information for the specified username.
 * @name Get user info.
 * @route {GET} /users/:username
 */
router.get('/puskesmas/:username', (req, res, next) => {
    return queries.getPuskesmas(req.params.username)
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
router.patch('/puskesmas/:username', validators.updatePuskesmas, (req, res, next) => {
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
router.delete('/puskesmas/:username', (req, res, next) => {
    return queries.deletePuskesmas(req.params.username)
        .then((affectedRowCount) => {
            return res.json({ affectedRowCount: affectedRowCount });
        })
        .catch(next);
});

module.exports = router;