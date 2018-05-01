"use strict";

const express = require("express");
const { conn, rethink } = require("../components/rethinkdb");
const auth = require("../components/auth.js");

const router = express.Router();

/**
 * Get a list of notifications.
 * @name Get notifications
 * @route {GET} /notifications
 */
router.get("/notification", auth.middleware.isLoggedIn, (req, res, next) => {
  const skip = req.query.page ? req.query.page : 0;
  const limit = req.query.limit ? req.query.limit : 10;
  const end = skip * limit + limit;

  conn
    .then(connection => {
      rethink
        .table("notifications")
        .filter({ username: req.user.username })
        .withFields("notifications")
        .merge(row => row("notifications").orderBy(rethink.desc("timestamp")))
        .slice(skip * limit, end)
        .run(connection)
        .then(cursor => {
          return cursor.toArray();
        })
        .then(result => {
          const [resultInArray] = result;
          if (result.length > 0) return res.json(resultInArray);
          return res.json(result);
        })
        .catch(next);
    })
    .error(next);
});

module.exports = router;
