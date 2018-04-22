"use strict";

/**
 * @module app/common/helper
 */

var knex = require("../components/knex.js");

module.exports = {
  getRole: username => {
    return knex("users")
      .first("role")
      .where("username", username);
  }
};
