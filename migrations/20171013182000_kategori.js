exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('kategori', table => {
      table.increments('id_kategori').primary();
      table.string('nama_kategori');
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('kategori')]);
};
