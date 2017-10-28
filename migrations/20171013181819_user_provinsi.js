exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('user_provinsi', table => {
      table
        .string('username')
        .primary()
        .references('users.username');
      table.string('nama_provinsi').unique();
      table.string('kepala_dinas');
      table.string('alamat');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('user_provinsi')]);
};
