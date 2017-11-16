exports.seed = (knex, Promise) => {
  let provinsiQuery = () => {
    return knex('user_provinsi')
      .then(() => {
        let users = [
          {
            username: 'sumatera_utara',
            email: 'sumatera_utara_provinsi@e-gov.id',
            password:
              '$2y$10$Pe7WP9.qytIhowGEr8hF2uA4sk6F0mrd5FjRX77PKBxNweM9H85X6',
            role: 'provinsi',
            status: 'disabled'
          } // Password: admin
        ];
        return Promise.all([
          // Inserts seed entries
          knex('users').insert(users)
        ]);
      })
      .then(() => {
        let provinsi = [
          {
            username: 'sumatera_utara',
            nama: 'sumatera_utara',
            nama_dinas: 'dinas_uksu',
            kepala_dinas: 'Ray',
            alamat: 'Jalan medan no.10'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('user_provinsi').insert(provinsi)
        ]);
      });
  };

  let kotaQuery = () => {
    return knex('user_kota')
      .then(() => {
        let users = [
          {
            username: 'kota_medan',
            email: 'kota_medan@e-gov.id',
            password:
              '$2y$10$Pe7WP9.qytIhowGEr8hF2uA4sk6F0mrd5FjRX77PKBxNweM9H85X6',
            role: 'kota',
            status: 'disabled'
          } // Password: admin
        ];
        return Promise.all([
          // Inserts seed entries
          knex('users').insert(users)
        ]);
      })
      .then(() => {
        let kota = [
          {
            username: 'kota_medan',
            username_provinsi: 'sumatera_utara',
            nama: 'medan',
            nama_dinas: 'dinas_medan',
            kepala_dinas: 'Ray',
            alamat: 'Jalan medan no.10'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('user_kota').insert(kota)
        ]);
      });
  };

  let puskesmasQuery = () => {
    return knex('user_puskesmas')
      .then(() => {
        let users = [
          {
            username: 'puskesmas_medan',
            email: 'puskesmas_medan@e-gov.id',
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
            username: 'puskesmas_medan',
            username_kota: 'kota_medan',
            nama: 'datafreaksPuskesmas1',
            nama_dinas: 'dinas_puskesmas_medan',
            kepala_dinas: 'Ray',
            alamat: 'Jalan medan no.10'
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
            username: 'kestrad_medan',
            email: 'kestrad_medan@e-gov.id',
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
            username: 'kestrad_medan',
            username_puskesmas: 'puskesmas_medan',
            nama: 'datafreaksKestrad',
            penanggung_jawab: 'Ray',
            alamat: 'Jalan medan no.10',
            kecamatan: 'medan_kota'
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
          username_kestrad: 'kestrad_medan',
          nama_layanan: 'herbal',
          verified: 'awaiting_validation'
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
          nama: 'Aggi',
          ijin_hattra: '151515',
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
    .then(provinsiQuery)
    .then(kotaQuery)
    .then(puskesmasQuery)
    .then(kestradQuery)
    .then(layananQuery)
    .then(hattraQuery);
};
