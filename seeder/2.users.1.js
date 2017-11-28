exports.seed = (knex, Promise) => {
  let kotaQuery = () => {
    return knex('user_kota')
      .then(() => {
        let users = [
          {
            username: 'kota_parapat',
            email: 'kota_medan@e-gov.id',
            password:
              '$2y$10$29ee5/vqi.knOGA99cYy2en8cBJOAivT/18N.UG04ecdYn9G6mv8a',
            role: 'kota',
            status: 'active'
          } // Password: kota_parapat
        ];
        return Promise.all([
          // Inserts seed entries
          knex('users').insert(users)
        ]);
      })
      .then(() => {
        let kota = [
          {
            username: 'kota_parapat',
            username_provinsi: 'sumatera_utara',
            nama: 'parapat',
            kepala_dinas: 'Verin',
            alamat: 'Jalan parapat no.10'
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
            username: 'pusk_parapat',
            email: 'pusk_parapat@e-gov.id',
            password:
              '$2y$10$jPMPgZNIIzpmT/Ad8HGHs.CeeNN2Q.TMZsdeLkD9JJ3v97.pVmEYS',
            role: 'puskesmas',
            status: 'active'
          } // Password: pusk_parapat
        ];
        return Promise.all([
          // Inserts seed entries
          knex('users').insert(users)
        ]);
      })
      .then(() => {
        let puskesmas = [
          {
            username: 'pusk_parapat',
            username_kota: 'kota_parapat',
            nama: 'datafreaksPuskesmas2',
            kepala_dinas: 'Verin',
            alamat: 'Jalan parapat no.10'
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
            username: 'kestrad_parapat',
            email: 'kestrad_parapat@e-gov.id',
            password:
              '$2y$10$zPUOTzeyNVsRGqGagopdZ.qrTjxwygO7CJGftuL3MRHgXnMZZyvlW',
            role: 'kestrad',
            status: 'active'
          } // Password: kestrad_parapat
        ];
        return Promise.all([
          // Inserts seed entries
          knex('users').insert(users)
        ]);
      })
      .then(() => {
        let kestrad = [
          {
            username: 'kestrad_parapat',
            username_puskesmas: 'pusk_parapat',
            nama: 'datafreaksKestrad',
            penanggung_jawab: 'Verin',
            alamat: 'Jalan parapat no.10',
            kecamatan: 'parapat_kota'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('user_kestrad').insert(kestrad)
        ]);
      });
  };

  let kategoriQuery = () => {
    return knex('kategori').then(() => {
      let kategori = [
        {
          nama_kategori: 'fisiologi'
        }
      ];
      return Promise.all([
        // Inserts seed entries
        knex('kategori').insert(kategori)
      ]);
    });
  };

  let subkategoriQuery = () => {
    return knex('kategori').then(() => {
      let subkategori = [
        {
          id_kategori: 1,
          nama_subkategori: 'gerakan_sehat'
        }
      ];
      return Promise.all([
        // Inserts seed entries
        knex('subkategori').insert(subkategori)
      ]);
    });
  };

  let layananQuery = () => {
    return knex('layanan').then(() => {
      let layanan = [
        {
          id_subkategori: 1,
          username_kestrad: 'kestrad_parapat',
          nama_layanan: 'tusuk',
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
          nama: 'Aldrich',
          ijin_hattra: '121512',
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
    .then(kotaQuery)
    .then(puskesmasQuery)
    .then(kestradQuery)
    .then(kategoriQuery)
    .then(subkategoriQuery)
    .then(layananQuery)
    .then(hattraQuery);
};
