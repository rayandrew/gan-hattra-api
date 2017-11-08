exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTable('user_kestrad', table => {
            table.string('username').primary().references('users.username').onDelete('CASCADE');
            table.string('username_puskesmas').references('user_puskesmas.nama').onDelete('CASCADE');
            table.string('nama');
            table.string('nama_dinas');
            table.string('kepala_dinas');
            table.string('alamat');
            table.timestamps();
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTable('user_kestrad')
    ]);
};