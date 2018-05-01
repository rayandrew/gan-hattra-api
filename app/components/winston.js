"use strict";

/**
 * @module app/components/winston
 */

const winston = require("winston");
const config = require("config");

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "cyan",
  verbose: "grey",
  debug: "blue",
  silly: "magenta"
});

// Re-apply transport to update settings
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, config.get("winston.console"));

/** An instance of [Winston](https://github.com/winstonjs/winston) logger set up to use color in its console output. */
module.exports = winston;
