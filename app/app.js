"use strict";

/**
 * The application main module.
 * @module app/app
 */
/* Load dependencies */
const path = require("path");
const listFiles = require("fs-readdir-recursive");
const config = require("config");
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const errorHandler = require("api-error-handler");
const winston = require("./components/winston.js");
const session = require("./components/session.js");
const passport = require("./components/passport.js");

/* Create app and logger */

const app = express();
global.appDirectory = __dirname;

/* Create the logger */

winston.log(":: gan-hattra-api ::");
winston.log("NODE_ENV: %s\n", process.env.NODE_ENV);

/* Set up Express middleware */

winston.log("verbose", "Setting up Express middleware...");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

/* Load and apply routes */

winston.log("verbose", "Loading and applying routes...");

const routeDirectory = global.appDirectory;
listFiles(routeDirectory)
  .filter(file => file.endsWith(".routes.js"))
  .forEach(file => {
    const routerPath = path.join(routeDirectory, file);
    const router = require(routerPath);
    if (!router.baseRoute) router.baseRoute = "/";
    const completeRoute = config.get("routePrefix") + router.baseRoute;

    winston.log("verbose", "Using route %s...", completeRoute);
    app.use(completeRoute, router);
  });

/* Apply Express error handler */

app.use(errorHandler());

/** The [Express](https://expressjs.com/) application object, ready to run. */
module.exports = app;
