exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTable('subkategori', table => {
            table.int('id_subkategori').primary();
            table.int('id_kategori').references('kategori').onDelete('CASCADE');
            table.string('nama_subkategori');
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTable('subkategori')
    ]);
};