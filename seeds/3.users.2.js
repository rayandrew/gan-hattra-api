exports.seed = (knex, Promise) => {
  let puskesmasQuery = () => {
    return knex('user_puskesmas')
      .then(() => {
        let users = [
          {
            username: 'puskesmas_bunda',
            email: 'puskesmas_bunda@e-gov.id',
            password:
              '$2a$08$QwNk.YBBpry2N09/LVudj.ZvVtkL.6JIYvGd8Y8MT9VQ3mMfHwF8S',
            role: 'puskesmas',
            status: 'disabled'
          } // Password: admin
        ];
        return Promise.all([
          // Inserts seed entries
          knex('users').insert(users)
        ]);
      })
      .then(() => {
        let puskesmas = [
          {
            username: 'puskesmas_bunda',
            username_kota: 'kota_parapat',
            nama: 'datafreaksPuskesmas',
            nama_dinas: 'dinas_puskesmas_bunda',
            kepala_dinas: 'Verin',
            alamat: 'Jalan bunda no.10'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('user_puskesmas').insert(puskesmas)
        ]);
      });
  };

  let kestradQuery = () => {
    return knex('user_kestrad')
      .then(() => {
        let users = [
          {
            username: 'kestrad_bunda',
            email: 'kestrad_bunda@e-gov.id',
            password:
              '$2a$08$QwNk.YBBpry2N09/LVudj.ZvVtkL.6JIYvGd8Y8MT9VQ3mMfHwF8S',
            role: 'kestrad',
            status: 'disabled'
          } // Password: admin
        ];
        return Promise.all([
          // Inserts seed entries
          knex('users').insert(users)
        ]);
      })
      .then(() => {
        let kestrad = [
          {
            username: 'kestrad_bunda',
            username_puskesmas: 'puskesmas_bunda',
            nama: 'datafreaksKestrad',
            penanggung_jawab: 'Verin',
            jumlah_pegawai: 12,
            alamat: 'Jalan bunda no.10',
            kecamatan: 'bunda_kota'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('user_kestrad').insert(kestrad)
        ]);
      });
  };

  let layananQuery = () => {
    return knex('layanan')
      .then(() => {
        let layanan = [
          {
            id_subkategori: 0,
            username_kestrad: 'kestrad_bunda',
            nama_layanan: 'gigit',
            verified: 'menunggu'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('layanan').insert(layanan)
        ]);
      })
  };

  let hattraQuery = () => {
    return knex('hattra')
      .then(() => {
        let hattra = [
          {
            id_layanan: 0,
            nama_hattra: 'Agus',
            ijin_hattra: '164531',
            verified: 'menunggu'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('hattra').insert(hattra)
        ]);
      })
  };

  let puskesmasCountQuery = () => {
    return knex('user_provinsi_additional')
      .then(() => {
        let additional = [
          {
            username: 'puskesmas_bunda'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('user_puskesmas_additional').insert(additional)
        ]);
      })
  };

  let kestradCountQuery = () => {
    return knex('user_kestrad_additional')
      .then(() => {
        let additional = [
          {
            username: 'kestrad_bunda'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('user_kestrad_additional').insert(additional)
        ]);
      })
  };

  return knex('users')
  .then(puskesmasQuery)
  .then(kestradQuery)
  .then(layananQuery)
  .then(hattraQuery)
  .then(puskesmasCountQuery)
  .then(kestradCountQuery);
};
