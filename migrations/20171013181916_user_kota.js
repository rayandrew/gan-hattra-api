exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('user_kota', table => {
      table
        .string('username')
        .primary()
        .references('users.username');
      table.string('nama_provinsi').references('user_provinsi.nama');
      table.string('nama').unique();
      table.string('nama_dinas');
      table.string('kepala_dinas');
      table.string('alamat');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('user_kota')]);
};
