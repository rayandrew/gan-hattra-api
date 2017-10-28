const rethinkdb = require('rethinkdb');
const config = require('config');

rethinkdb.connect(config.get('rethinkdb')).then(connection => {
  rethinkdb
    .dbCreate(config.get('rethinkdb').db)
    .run(connection)
    .then(db =>
      console.log('success create database ' + config.get('rethinkdb').db)
    )
    .then(() => {
      rethinkdb
        .db(config.get('rethinkdb').db)
        .tableCreate('notifications', { primaryKey: 'username' })
        .run(connection)
        .then(() => console.log('success create table notifications'))
        .catch(err => console.log(err));
    })
    .then(() => {
      rethinkdb
        .db(config.get('rethinkdb').db)
        .tableCreate('feedbacks', { primaryKey: 'username' })
        .run(connection)
        .then(() => console.log('success create table feedbacks'))
        .catch(err => console.log(err));
    })
    .then(() => process.exit(0))
    .catch(err => console.log(err));
});
