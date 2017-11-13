exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('hattra', table => {
      table.increments('id_hattra').primary();
      table
        .integer('id_layanan')
        .unsigned()
        .references('layanan.id_layanan')
        .onDelete('CASCADE');
      table.string('nama');
      table.string('ijin_hattra');
      table.string('verifed');
      table.timestamp('tanggal_verified').defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('hattra')]);
};
