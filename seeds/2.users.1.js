exports.seed = (knex, Promise) => {
  let kotaQuery = () => {
    return knex('user_kota')
      .then(() => {
        let users = [
          {
            username: 'kota_parapat',
            email: 'kota_medan@e-gov.id',
            password:
              '$2a$08$QwNk.YBBpry2N09/LVudj.ZvVtkL.6JIYvGd8Y8MT9VQ3mMfHwF8S',
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
            username: 'kota_parapat',
            username_provinsi: 'sumatera_utara',
            nama: 'parapat',
            nama_dinas: 'dinas_parapat',
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
            username: 'puskesmas_parapat',
            email: 'puskesmas_parapat@e-gov.id',
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
            username: 'puskesmas_parapat',
            username_kota: 'kota_parapat',
            nama: 'datafreaksPuskesmas',
            nama_dians: 'dinas_puskesmas_parapat',
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
            username: 'kestrad_parapat',
            username_puskesmas: 'puskesmas_parapat',
            nama: 'datafreaksKestrad',
            penanggung_jawab: 'Verin',
            jumlah_pegawai: 12,
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
    return knex('kategori')
      .then(() => {
        let kategori = [
          {
            nama_kategori: 'fisiologi'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('kategori').insert(kategori)
        ]);
      })
  };

  let subkategoriQuery = () => {
    return knex('kategori')
      .then(() => {
        let subkategori = [
          {
            id_kategori: 0,
            nama_subkategori: 'gerakan_sehat'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('subkategori').insert(subkategori)
        ]);
      })
  };

  let layananQuery = () => {
    return knex('layanan')
      .then(() => {
        let layanan = [
          {
            id_subkategori: 0,
            username_kestrad: 'kestrad_parapat',
            nama_layanan: 'tusuk',
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
            nama_hattra: 'Aldrich',
            ijin_hattra: '121512'
            verified: 'menunggu'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('hattra').insert(hattra)
        ]);
      })
  };

  let kotaCountQuery = () => {
    return knex('user_kota_additional')
      .then(() => {
        let additional = [
          {
            username: 'kota_parapat'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('user_kota_additional').insert(additional)
        ]);
      })
  };

  let puskesmasCountQuery = () => {
    return knex('user_provinsi_additional')
      .then(() => {
        let additional = [
          {
            username: 'puskesmas_parapat'
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
            username: 'kestrad_parapat'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('user_kestrad_additional').insert(additional)
        ]);
      })
  };

  return knex('users')
  .then(kotaQuery)
  .then(puskesmasQuery)
  .then(kestradQuery)
  .then(kategoriQuery)
  .then(subkategoriQuery)
  .then(layananQuery)
  .then(hattraQuery)
  .then(kotaCountQuery)
  .then(puskesmasCountQuery)
  .then(kestradCountQuery);
};
