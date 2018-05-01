const rethinkdb = require("rethinkdb");
const config = require("config");

module.exports = {
  conn: rethinkdb.connect(config.get("rethinkdb")),
  rethink: rethinkdb
};
