exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTable('user_kestrad', table => {
            table.string('username').primary().references('users.username');
            table.string('nama_puskesmas').references('user_puskesmas.nama');
            table.string('nama');
            table.string('penanggung_jawab');
            table.integer('jumlah_pegawai');
            table.string('alamat');
            table.string('kecamatan');
            table.string('verified');
            table.datetime('tanggal_verifikasi');
            table.timestamps();
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTable('user_kestrad')
    ]);
};