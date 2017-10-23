'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const validators = require('./provinsi.validators.js');
const validatorUser = require('../users/users.validators.js');
const errors = require('http-errors');
const queries = require('./provinsi.queries.js');
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
 * Get a list of provinsi.
 * @name Get provinsi
 * @route {GET} /provinsi
 */
router.get('/provinsi', validators.listProvinsi, (req, res, next) => {
  return queries.listProvinsi(req.query.search, req.query.page, req.query.perPage, req.query.sort)
    .then((result) => {
      return res.json(result);
    })
    .catch(next);
});

/**
 * Get a list of provinsi for searching.
 * @name Search provinsi
 * @route {GET} /provinsi
 */
router.get('/provinsi/search', auth.middleware.isLoggedIn, (req, res, next) => {
  return queries.searchProvinsi(req.query.search, req.query.category)
    .then((result) => {
      return res.json(result);
    })
    .catch(next);
});

/**
 * Creates a new user.
 * @name Create user
 * @route {POST} /provinsi
 */
router.post('/provinsi', validatorUser.createUser, (req, res, next) => { // TODO: email/captcha validation
  const publicUserRegistration = config.get('publicUserRegistration');
  const isAdmin = auth.predicates.isAdmin(req.user);

  if (!isAdmin && !publicUserRegistration) return next(new errors.Forbidden());

  req.body.status = 'active';

  if (auth.predicates.isProvinsi(req.user)) {
    if(!req.body.username) req.body.username = usernameGenerator('kota', req.body.nama); 
    req.body.role = 'kota';
  } else {
    req.body.role = 'user';
    req.body.status = 'awaiting_validation';
  }

  if(!req.body.password) req.body.password = req.body.username;

  return queries.createProvinsi(req.body)
    .then((insertedUser) => {
      return res.status(201).json(insertedUser);
    })
    .catch(next);
});

/**
 * Get specific user information for the specified username.
 * @name Get user info.
 * @route {GET} /provinsi/:username
 */
router.get('/provinsi/:username', (req, res, next) => {
  return queries.getUser(req.params.username)
    .then((user) => {
      if (!user) return next(new errors.NotFound('User not found.'));
      return res.json(user);
    })
    .catch(next);
});

/**
 * Updates user information for the given username.
 * @name Update user
 * @route {PATCH} /provinsi/:username
 */
router.patch('/provinsi/:username', validators.updateProvinsi, (req, res, next) => {
  let userUpdates = {
    nama: req.body.nama,
    nama_dinas: req.body.nama_dinas,
    kepala_dinas: req.body.kepala_dinas,
    alamat: req.body.alamat,
  };

  return queries.updateUser(req.params.username, userUpdates, requireOldPasswordCheck, req.body.oldPassword)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

/**
 * Delete the specified user.
 * @name Delete user
 * @route {DELETE} /provinsi/:username
 */
router.delete('/provinsi/:username', (req, res, next) => {
  return queries.deleteUser(req.params.username)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

module.exports = router;
