exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('user_kestrad', table => {
      table
        .string('username')
        .primary()
        .references('users.username')
        .onDelete('CASCADE');
      table
        .string('username_puskesmas')
        .references('user_puskesmas.username')
        .onDelete('CASCADE');
      table.string('nama');
      table.string('penanggung_jawab');
      table.string('alamat');
      table.string('kecamatan');
      table.timestamps();
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('user_kestrad')]);
};
