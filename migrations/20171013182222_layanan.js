exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('layanan', table => {
      table.increments('id_layanan').primary();
      table
        .integer('id_subkategori')
        .unsigned()
        .references('subkategori.id_subkategori')
        .onDelete('CASCADE');
      table
        .string('username_kestrad')
        .references('user_kestrad.username')
        .onDelete('CASCADE');
      table.string('nama_layanan');
      table.string('verified');
      table.timestamp('tanggal_verified').defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('layanan')]);
};
