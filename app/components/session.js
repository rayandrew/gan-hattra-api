'use strict';

/**
 * @module app/components/session
 */

const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const config = require('config');
const redisClient = require('./redis.js');
const sessionStore = new RedisStore({ client: redisClient, prefix: 'pmkdata:session:' });

/**
 * An [Express](https://expressjs.com/) middleware which enables session support using a Redis session store,
 * using a secret key from the `secret` section in the app configuration.
 */
module.exports = session({
  resave: false,
  saveUninitialized: false,
  secret: config.get('secret'),
  store: sessionStore
});
