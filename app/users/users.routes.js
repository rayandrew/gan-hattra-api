'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const validators = require('./users.validators.js');
const errors = require('http-errors');
const queries = require('./users.queries.js');
const config = require('config');

const router = express.Router();

/** custom username generator */
const usernameGenerator = (pred, name) => {
  const nameArr = name.split(' ').map(val => val.toLowerCase());
  return (pred + '_' + nameArr.join('')).substring(0, 255);
};

const isOwnerOrKestradAndHigher = auth.createMiddlewareFromPredicate(
  (user, req) => {
    return (
      user.username === req.params.username ||
      auth.predicates.isKestradOrHigher(user)
    );
  }
);

/**
 * Get a list of users.
 * @name Get users
 * @route {GET} /users
 */
router.get(
  '/users',
  auth.middleware.isAdmin,
  validators.listUsers,
  (req, res, next) => {
    return queries
      .listUsers(
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
 * Get a list of users for searching.
 * @name Search users
 * @route {GET} /users/search
 */
router.get('/users/search', auth.middleware.isLoggedIn, (req, res, next) => {
  return queries
    .searchUsers(req.query.search)
    .then(result => {
      return res.json(result);
    })
    .catch(next);
});

/**
 * Get specific user information for the specified username.
 * @name Get user info.
 * @route {GET} /users/:username
 */
router.get('/users/:username', auth.middleware.isAdmin, (req, res, next) => {
  return queries
    .getUser(req.params.username)
    .then(user => {
      if (!user) return next(new errors.NotFound('User not found.'));
      return res.json(user);
    })
    .catch(next);
});

/**
 * Creates a new user.
 * @name Create user
 * @route {POST} /users
 */
router.post(
  '/users',
  auth.middleware.isLoggedIn,
  validators.createUser,
  (req, res, next) => {
    // TODO: email/captcha validation
    const publicUserRegistration = config.get('publicUserRegistration');
    const isAdmin = auth.predicates.isAdmin(req.user);

    if (!isAdmin && !publicUserRegistration) {
      return next(new errors.Forbidden());
    }

    req.body.status = 'active';

    if (auth.predicates.isProvinsi(req.user)) {
      if (!req.body.username) {
        req.body.username = usernameGenerator('kota', req.body.nama);
      }
      req.body.role = 'kota';
    } else if (auth.predicates.isKota(req.user)) {
      if (!req.body.username) {
        req.body.username = usernameGenerator('pusk', req.body.nama);
      }
      req.body.role = 'puskesmas';
    } else if (auth.predicates.isPuskesmas(req.user)) {
      if (!req.body.username) {
        req.body.username = usernameGenerator('kestrad', req.body.nama);
      }
      req.body.role = 'kestrad';
    } else if (isAdmin) {
      if (!req.body.username) {
        req.body.username = usernameGenerator('provinsi', req.body.nama);
      }
      req.body.role = 'provinsi';
    } else {
      req.body.role = 'user';
      req.body.status = 'awaiting_validation';
    }

    if (!req.body.password) req.body.password = req.body.username;

    return queries
      .createUser(req.body, req.user.username)
      .then(insertedUser => {
        return res.status(201).json(insertedUser);
      })
      .catch(next);
  }
);

/**
 * Updates user information for the given username.
 * @name Update user
 * @route {PATCH} /users/:username
 */
router.patch(
  '/users/:username',
  auth.middleware.isAdmin,
  validators.updateUser,
  (req, res, next) => {
    let userUpdates = {
      email: req.body.email,
      password: req.body.password,
      status: req.body.status
    };
    if (req.params.username) {
      return queries
        .updateUser(req.params.username, userUpdates)
        .then(affectedRowCount => {
          return res.json({ affectedRowCount: affectedRowCount });
        })
        .catch(next);
    } else {
      return queries
        .updateUser(req.user.username, userUpdates)
        .then(affectedRowCount => {
          return res.json({ affectedRowCount: affectedRowCount });
        })
        .catch(next);
    }
  }
);

/**
 * Delete the specified user.
 * @name Delete user
 * @route {DELETE} /users/:username
 */
router.delete('/users/:username', auth.middleware.isAdmin, (req, res, next) => {
  return queries
    .deleteUser(req.params.username)
    .then(affectedRowCount => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

/**
 * Updates password for the given username.
 * @name Update user
 * @route {GET} /users/:username/resetpassword
 */
router.patch(
  '/users/:username/resetpassword',
  auth.middleware.isPuskesmasOrHigher,
  (req, res, next) => {
    let userUpdates = {
      password: req.params.username
    };

    if (req.params.username) {
      return queries
        .resetPassword(
          userUpdates,
          req.params.username,
          req.user.username,
          req.user.role
        )
        .then(affectedRowCount => {
          return res.status(200).json({ affectedRowCount: affectedRowCount });
        })
        .catch(next);
    }
  }
);

module.exports = router;
