exports.seed = (knex, Promise) => {
  let deleteQuery = () => {
    return knex('user_kestrad_additional').del()
      .then(() => {
        return knex('user_puskesmas_additional').del();
      })
      .then(() => {
        return knex('user_kota_additional').del();
      })
      .then(() => {
        return knex('user_provinsi_additional').del();
      })
      .then(() => {
        return knex('hattra').del();
      })
      .then(() => {
        return knex('layanan').del();
      })
      .then(() => {
        return knex('subkategori').del();
      })
      .then(() => {
        return knex('kategori').del();
      })
      .then(() => {
        return knex('user_kestrad').del();
      })
      .then(() => {
        return knex('user_puskesmas').del();
      })
      .then(() => {
        return knex('user_kota').del();
      })
      .then(() => {
        return knex('user_provinsi').del();
      })
      .then(() => {
        return knex('users').del();
      });
  };
  
  let adminQuery = () => {
     return knex('users')
    .then(() => {
      let users = [
        {
          username: 'admin',
          email: 'admin@e-gov.id',
          password:
            '$2y$10$3ApPdLQHjB.i69PVYPyV3eMXT/qjkKNKo4grgkkRk8AOGm7RA/Xvy',
          role: 'admin',
          status: 'active'
        } // Password: admin
      ];
      return Promise.all([
        // Inserts seed entries
        knex('users').insert(users)
      ]);
    });
  };

  let provinsiQuery = () => {
    return knex('user_provinsi')
      .then(() => {
        let users = [
          {
            username: 'jawa_barat',
            email: 'jawa_barat_provinsi@e-gov.id',
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
            username: 'jawa_barat',
            nama: 'jawa_barat',
            nama_dinas: 'dinas_jabar',
            kepala_dinas: 'Adrian',
            alamat: 'Jalan Ranggagempol no.10'
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
            username: 'kota_tasik',
            email: 'kota_tasik@e-gov.id',
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
            username: 'kota_tasik',
            username_provinsi: 'jawa_barat',
            nama: 'tasik',
            nama_dinas: 'dinas_tasik',
            kepala_dinas: 'Adrian',
            alamat: 'Jalan Ranggagempol no.10'
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
            username: 'puskesmas_tasik',
            email: 'puskesmas_tasik@e-gov.id',
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
            username: 'puskesmas_tasik',
            username_kota: 'kota_tasik',
            nama: 'datafreaksPuskesmas',
            nama_dinas: 'dinas_puskesmas_tasik',
            kepala_dinas: 'Adrian',
            alamat: 'Jalan Ranggagempol no.10'
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
            username: 'kestrad_tasik',
            email: 'kestrad_tasik@e-gov.id',
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
            username: 'kestrad_tasik',
            username_puskesmas: 'puskesmas_tasik',
            nama: 'datafreaksKestrad',
            penanggung_jawab: 'Adrian',
            jumlah_pegawai: 50,
            alamat: 'Jalan Ranggagempol no.10',
            kecamatan: 'Tawang'
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
            nama_kategori: 'pelajaran'
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
            nama_subkategori: 'pelajaran_olahraga'
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
            username_kestrad: 'kestrad_tasik',
            nama_layanan: 'akupuntur',
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
            nama_hattra: 'Ray',
            ijin_hattra: '123456',
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
            username: 'jawa_barat'
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
            username: 'kota_tasik'
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
            username: 'puskesmas_tasik'
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
            username: 'kestrad_tasik'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('user_kestrad_additional').insert(additional)
        ]);
      })
  };

  return knex('users')
    .then(deleteQuery)
    .then(adminQuery)
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
