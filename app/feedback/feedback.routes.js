'use strict';

const express = require('express');
const { conn, rethink } = require('../components/rethinkdb');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const config = require('config');
const winston = require('../components/winston');

const router = express.Router();

/**
 * Get a list of feedbacks.
 * @name Get feedbacks
 * @route {GET} /feedback
 */
router.get('/feedback', auth.middleware.isLoggedIn, (req, res, next) => {
  const skip = req.query.page ? req.query.page : 0;
  const limit = req.query.limit ? req.query.limit : 10;
  const end = skip * limit + limit;

  conn
    .then(connection => {
      rethink
        .table('feedbacks')
        .filter({ username: req.user.username })
        .withFields('feedbacks')
        .merge(row => row('feedbacks').orderBy(rethink.desc('timestamp')))
        .slice(skip * limit, end)
        .run(connection)
        .then(cursor => {
          return cursor.toArray();
        })
        .then(result => {
          const [resultInArray] = result;
          if (result.length > 0) return res.json(resultInArray);
          else return res.json(result);
        })
        .catch(next);
    })
    .error(next);
});

module.exports = router;
