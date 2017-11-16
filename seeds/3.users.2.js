exports.seed = (knex, Promise) => {
  let puskesmasQuery = () => {
    return knex('user_puskesmas')
      .then(() => {
        let users = [
          {
            username: 'puskesmas_bunda',
            email: 'puskesmas_bunda@e-gov.id',
            password:
              '$2y$10$Pe7WP9.qytIhowGEr8hF2uA4sk6F0mrd5FjRX77PKBxNweM9H85X6',
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
            nama: 'datafreaksPuskesmas3',
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
              '$2y$10$Pe7WP9.qytIhowGEr8hF2uA4sk6F0mrd5FjRX77PKBxNweM9H85X6',
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
    return knex('layanan').then(() => {
      let layanan = [
        {
          id_subkategori: 1,
          username_kestrad: 'kestrad_bunda',
          nama_layanan: 'gigit',
          verified: 'menunggu'
        }
      ];
      return Promise.all([
        // Inserts seed entries
        knex('layanan').insert(layanan)
      ]);
    });
  };

  let hattraQuery = () => {
    return knex('hattra').then(() => {
      let hattra = [
        {
          id_layanan: 1,
          nama: 'Agus',
          ijin_hattra: '164531',
          verified: 'menunggu'
        }
      ];
      return Promise.all([
        // Inserts seed entries
        knex('hattra').insert(hattra)
      ]);
    });
  };

  return knex('users')
    .then(puskesmasQuery)
    .then(kestradQuery)
    .then(layananQuery)
    .then(hattraQuery);
};
