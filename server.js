#!/usr/bin/env node

/**
 * A HTTP server which serves the API. Acts as the entry point of the application.
 * @module server
 * @see module:app/app
 */

const config = require('config');
const http = require('http');

/** The application to serve. Read from `app/app.js`. */
const app = require('./app/app.js');

/** The port to use for the application. Obtained from configuration, normalized, then stored in the app object. */
const port = normalizePort(config.get('port'));

/** The HTTP server. */
const server = http.createServer(app).listen(port);

// Listen on provided port, on all network interfaces.
server.on('error', onError);
server.on('listening', onListening);

io = require('socket.io').listen(server);

const { conn, rethink } = require('./app/components/rethinkdb');
const _ = require('lodash');
io.on('connection', socket => {
  socket.on('notication_request', username => {
    conn.then(connection => {
      rethink
        .table('notifications')
        .filter({ username })
        .withFields('notifications')
        .changes()
        .run(connection)
        .then(cursor => {
          cursor.each((err, row) => {
            if (err) throw err;
            io.emit('notification_updated', _.last(row.new_val.notifications));
          });
        })
        .catch(err => winston.error(error));
    });
  });

  socket.on('feedback_request', username => {
    conn.then(connection => {
      rethink
        .table('feedbacks')
        .filter({ username })
        .withFields('feedbacks')
        .changes()
        .run(connection)
        .then(cursor => {
          cursor.each((err, row) => {
            if (err) throw err;
            io.emit('feedback_updated', _.last(row.new_val.feedbacks));
          });
        })
        .catch(err => winston.error(error));
    });
  });
});

/**
 * Normalize a port into a number, string, or false.
 * @param val {number|string} Port number or socket name.
 * @returns A normalized port number or socket name; returns false if the given port number is invalid (negative).
 */
function normalizePort (val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 * @param error {Error} The server error object.
 */
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening () {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('<<< Listening on ' + bind + ' >>>');
}
