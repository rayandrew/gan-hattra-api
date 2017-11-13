exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('hattra_additional', table => {
      table
        .integer('id_hattra')
        .unsigned()
        .primary()
        .references('hattra.id_hattra')
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
      table
        .integer('id_layanan')
        .unsigned()
        .references('layanan.id_layanan')
        .onDelete('CASCADE');
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('hattra_additional')]);
};
  