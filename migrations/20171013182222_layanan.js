exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('layanan', table => {
      table.increments('id_layanan').primary();
      table
        .integer('id_subkategori')
        .unsigned()
        .references('subkategori.id_subkategori');
      table.string('username_kestrad').references('user_kestrad.username');
      table.string('nama_layanan');
      table.string('verified');
      table.timestamp('tanggal_verified').nullable();
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('layanan')]);
};
