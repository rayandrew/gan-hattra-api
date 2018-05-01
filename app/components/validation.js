"use strict";

/**
 * @module app/components/validation
 */

const Ajv = require("ajv");
const errors = require("http-errors");

const ajv = new Ajv({
  coerceTypes: true,
  removeAdditional: true,
  format: "full" // Full mode for date-time validation, i.e. not only regex
});

module.exports = {
  /**
   * Creates an [Express](https://expressjs.com/) middleware that validates req.body (or req.param, on a GET request) using the given JSON schema.
   * @param {object} schema - a JSON schema object that will be used for the validator.
   * @returns {function} -  an Express middleware function.
   */
  createValidator: schema => {
    const validate = ajv.compile(schema);
    return (req, res, next) => {
      let dataToValidate;
      if (req.method.toUpperCase() === "GET") {
        dataToValidate = req.query;
      } else {
        dataToValidate = req.body;
      }
      const valid = validate(dataToValidate);
      if (!valid) {
        return next(
          new errors.UnprocessableEntity("Validation error.", validate.errors)
        );
      }
      return next();
    };
  }
};
