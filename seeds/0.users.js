exports.seed = (knex, Promise) => {
  let deleteQuery = () => {
    return knex('user_kestrad_additional')
      .del()
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
    return knex('users').then(() => {
      let users = [
        {
          username: 'administrator',
          email: 'administrator@e-gov.id',
          password:
            '$2y$10$Kpea1D0bgVz20Zobyt.92ux791xrrw6jR98uAmAhflqF3oZ5VlDK2',
          role: 'admin',
          status: 'active'
        } // Password: administrator
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
            username: 'prov_jawabarat',
            email: 'prov_jawabarat@e-gov.id',
            password:
              '$2y$10$/LvWOZISfQF.bbh2SkXKSezVt1R/nirurUx/t.B4XKggZK6nYDVx2',
            role: 'provinsi',
            status: 'active'
          } // Password: prov_jawabarat
        ];
        return Promise.all([
          // Inserts seed entries
          knex('users').insert(users)
        ]);
      })
      .then(() => {
        let provinsi = [
          {
            username: 'prov_jawabarat',
            nama: 'prov_jawabarat',
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
              '$2y$10$Z6RxY9s.m/JDeANroZEt1ueybzmCXROHsKW6RIM5aAbHFIuzRySne',
            role: 'kota',
            status: 'active'
          } // Password: kota_tasik
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
            username_provinsi: 'prov_jawabarat',
            nama: 'tasik',
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

  let pusk_smasQuery = () => {
    return knex('user_puskesmas')
      .then(() => {
        let users = [
          {
            username: 'pusk_tasik',
            email: 'pusk_tasik@e-gov.id',
            password:
              '$2y$10$kCo/K2BzBYizhFrvdS0vOePkIiQ28j3Dndk.0eVV1GsbpZTy1euCm',
            role: 'pusk_smas',
            status: 'active'
          } // Password: admin
        ];
        return Promise.all([
          // Inserts seed entries
          knex('users').insert(users)
        ]);
      })
      .then(() => {
        let pusk_smas = [
          {
            username: 'pusk_tasik',
            username_kota: 'kota_tasik',
            nama: 'datafreakspusk_smas0',
            kepala_dinas: 'Adrian',
            alamat: 'Jalan Ranggagempol no.10'
          }
        ];
        return Promise.all([
          // Inserts seed entries
          knex('user_puskesmas').insert(pusk_smas)
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
              '$2y$10$KmX8x9E8xChsobNxipFjeexZh9V8P.0XU940Lnd8Ru3yGETHEvl12',
            role: 'kestrad',
            status: 'active'
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
            username_puskesmas: 'pusk_tasik',
            nama: 'datafreaksKestrad',
            penanggung_jawab: 'Adrian',
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
    return knex('kategori').then(() => {
      let kategori = [
        { nama_kategori: 'keterampilan' },
        { nama_kategori: 'ramuan' },
        { nama_kategori: 'campuran' }
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
          nama_subkategori: 'bekam'
        },
        {
          id_kategori: 1,
          nama_subkategori: 'pijat'
        },
        {
          id_kategori: 1,
          nama_subkategori: 'akupuntur'
        },
        {
          id_kategori: 2,
          nama_subkategori: 'herbal'
        },
        {
          id_kategori: 2,
          nama_subkategori: 'jamu'
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
          username_kestrad: 'kestrad_tasik',
          nama_layanan: 'akupuntur',
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
          nama: 'Ray',
          ijin_hattra: '123456',
          verified: 'awaiting_validation'
        }
      ];
      return Promise.all([
        // Inserts seed entries
        knex('hattra').insert(hattra)
      ]);
    });
  };

  return knex('users')
    .then(deleteQuery)
    .then(adminQuery)
    .then(provinsiQuery)
    .then(kotaQuery)
    .then(pusk_smasQuery)
    .then(kestradQuery)
    .then(kategoriQuery)
    .then(subkategoriQuery)
    .then(layananQuery)
    .then(hattraQuery);
};
