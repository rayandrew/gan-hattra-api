exports.up = (knex, Promise) => {
    return Promise.all(
        knex.schema.createTable('kategori', table => {
            table.int('id_kategori').primary();
            table.string('username').references('user_kestrad').onDelete('CASCADE');
            table.string('nama_kategori');
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTable('kategori')
    ]);
};