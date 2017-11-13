exports.seed = (knex, Promise) => {
  let provinsiQuery = () => {
    return knex('user_provinsi')
      .then(() => {
        let users = [
          {
            username: 'sumatera_utara',
            email: 'sumatera_utara_provinsi@e-gov.id',
            password:
              '$2a$08$QwNk.YBBpry2N09/LVudj.ZvVtkL.6JIYvGd8Y8MT9VQ3mMfHwF8S',
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
            username: 'puskesmas_medan',
            username_kota: 'kota_medan',
            nama: 'datafreaksPuskesmas',
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
            username: 'kestrad_medan',
            username_puskesmas: 'puskesmas_medan',
            nama: 'datafreaksKestrad',
            penanggung_jawab: 'Ray',
            jumlah_pegawai: 100,
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

  let kategoriQuery = () => {
    return knex('kategori')
      .then(() => {
        let kategori = [
          {
            nama_kategori: 'bagian_dalam'
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
            nama_subkategori: 'bedah_otak'
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
            username_kestrad: 'kestrad_medan',
            nama_layanan: 'herbal',
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
            nama_hattra: 'Aggi',
            ijin_hattra: '151515',
            verified: 'menunggu'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('hattra').insert(hattra)
        ]);
      })
  };

  let provinsiCountQuery = () => {
    return knex('user_provinsi_additional')
      .then(() => {
        let additional = [
          {
            username: 'sumatera_utara'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('user_provinsi_additional').insert(additional)
        ]);
      })
  };

  let kotaCountQuery = () => {
    return knex('user_kota_additional')
      .then(() => {
        let additional = [
          {
            username: 'kota_medan'
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
            username: 'puskesmas_medan'
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
            username: 'kestrad_medan'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('user_kestrad_additional').insert(additional)
        ]);
      })
  };

  return knex('users')
  .then(provinsiQuery)
  .then(kotaQuery)
  .then(puskesmasQuery)
  .then(kestradQuery)
  .then(kategoriQuery)
  .then(subkategoriQuery)
  .then(layananQuery)
  .then(hattraQuery)
  .then(provinsiCountQuery)
  .then(kotaCountQuery)
  .then(puskesmasCountQuery)
  .then(kestradCountQuery);
};
