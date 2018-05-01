/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */
"use strict";

/**
 * @module app/common/helper
 */

const config = require("config");
const _ = require("lodash");
const knex = require("../components/knex.js");

module.exports = {
  getRole: username => {
    return knex("users")
      .first("role")
      .where("username", username);
  },

  template: (strings, ...keys) => (...values) => {
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result
      .join("")
      .replace(/\s+/g, " ")
      .trim();
  },

  generateTest: (authenticated, credential, templates, tests) => {
    return _.zipWith(templates, tests, (template, test) => {
      if (_.isFunction(template)) {
        it(template({ ...test.props, ...credential }), async () => {
          if (_.isObject(test)) {
            if (_.isUndefined(test.payload)) {
              test.check(
                await authenticated[test.method](
                  module.exports.baseUrl(test.url)
                )
              );
            } else {
              test.check(
                await authenticated[test.method](
                  module.exports.baseUrl(test.url)
                ).send(test.payload)
              );
            }
          }
        });
      } else {
        describe(template.desc({ role: credential.role }), () => {
          return module.exports.generateTest(
            authenticated,
            credential,
            template.test,
            test
          );
        });
      }
    });
  },

  baseUrl: url => {
    return `${config.get("routePrefix")}${url}`;
  }
};
