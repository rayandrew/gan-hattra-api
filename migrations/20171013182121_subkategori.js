exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('subkategori', table => {
      table.increments('id_subkategori').primary();
      table
        .integer('id_kategori')
        .unsigned()
        .references('kategori.id_kategori')
        .onDelete('CASCADE');
      table.string('nama_subkategori');
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('subkategori')]);
};
