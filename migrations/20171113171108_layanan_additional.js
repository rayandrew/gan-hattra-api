exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('layanan_additional', table => {
      table
        .integer('id_layanan')
        .unsigned()
        .references('layanan.id_layanan')
        .onDelete('CASCADE');
      table
        .string('username_provinsi')
        .references('user_provinsi.username')
        .onDelete('CASCADE');
      table
        .string('username_kota')
        .references('user_kota.username')
        .onDelete('CASCADE');
      table
        .string('username_puskesmas')
        .references('user_puskesmas.username')
        .onDelete('CASCADE');
      table
        .string('username_kestrad')
        .references('user_kestrad.username')
        .onDelete('CASCADE');
      table.integer('count_hattra_verified').defaultTo(0);
      table.integer('count_hattra_not_verified').defaultTo(0);
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('layanan_additional')]);
};
