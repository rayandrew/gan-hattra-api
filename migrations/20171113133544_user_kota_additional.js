exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('user_kota_additional', table => {
      table
        .string('username')
        .primary()
        .references('user_kota.username')
        .onDelete('CASCADE');
      table
        .string('username_provinsi')
        .references('user_provinsi.username')
        .onDelete('CASCADE');
      table.integer('count_puskesmas').defaultTo(0);
      table.integer('count_kestrad').defaultTo(0);
      table.integer('count_layanan_verified').defaultTo(0);
      table.integer('count_layanan_not_verified').defaultTo(0);
      table.integer('count_hattra_verified').defaultTo(0);
      table.integer('count_hattra_not_verified').defaultTo(0);
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('user_kota_additional')]);
};
