
exports.up = (knex, Promise) => {
    return Promise.all([
      knex.schema.createTable('user_puskesmas', table => {
        table.string('username').primary().references('users.username');
        table.string('username_kota').references('user_kota.username');
        table.string('nama_puskesmas').unique();
        table.string('kepala_dinas');
        table.string('alamat');
        table.timestamps();
      })
    ]);
  };
  
  exports.down = (knex, Promise) => {
    return Promise.all([
      knex.schema.dropTable('user_puskesmas')
    ]);
  };
  