'use strict';

/**
 * @module app/components/redis
 */

const redis = require('redis');
const config = require('config');

/** A [Redis](https://redis.io/) client set up to use the connection specified in the `redis` section of the app configuration. */
module.exports = redis.createClient(config.get('redis'));
