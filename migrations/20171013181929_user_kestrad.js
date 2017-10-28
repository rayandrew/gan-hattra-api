exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('user_kestrad', table => {
      table
        .string('username')
        .primary()
        .references('users.username');
      table.string('username_puskesmas').references('user_puskesmas.username');
      table.string('nama_kestrad');
      table.string('kepala_dinas');
      table.string('alamat');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('user_kestrad')]);
};
