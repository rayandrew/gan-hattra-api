exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTable('layanan', table => {
            table.int('id_layanan').primary();
            table.int('id_subkategori').references('subkategori').onDelete('CASCADE');
            table.string('nama_layanan');
            table.string('verified');
            table.datetime('tanggal_verified');
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTable('layanan')
    ]);
};