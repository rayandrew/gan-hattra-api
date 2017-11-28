'use strict';

/**
 * @module app/users/routes
 */

const express = require('express');
const passport = require('../components/passport.js');
const auth = require('../components/auth.js');
const validators = require('./session.validators.js');

const router = express.Router();

/**
 * Get the current session information (currently only the current user).
 * @name Get current session
 * @route {GET} /session
 */
router.get('/session', auth.middleware.isLoggedIn, (req, res) => {
  return res.json(req.user);
});

/**
 * @name Create new session (login)
 * @route {POST} /session
 * @bodyparam username {string} The user's username.
 * @bodyparam password {string} The password entered.
 * @return {object} The current user information if login is successful, HTTP 401 otherwise.
 */
router.post(
  '/session',
  validators.createSession,
  passport.authenticate('local'),
  (req, res) => {
    console.log(req.user);
    return res.json(req.user);
  }
);

/* Logout */
router.delete('/session', (req, res) => {
  req.logout();
  return res.json({ message: 'Logged out successfully.' });
});

module.exports = router;
