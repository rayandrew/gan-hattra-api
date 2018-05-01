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
          nama_subkategori: 'Bekam'
        },
        {
          id_kategori: 1,
          nama_subkategori: 'Pijat'
        },
        {
          id_kategori: 1,
          nama_subkategori: 'Akupuntur'
        },
        {
          id_kategori: 2,
          nama_subkategori: 'Herbal'
        },
        {
          id_kategori: 2,
          nama_subkategori: 'Jamu'
        }
      ];
      return Promise.all([
        // Inserts seed entries
        knex('subkategori').insert(subkategori)
      ]);
    });
  };

  return knex('users')
    .then(deleteQuery)
    .then(adminQuery)
    .then(provinsiQuery)
    .then(kategoriQuery)
    .then(subkategoriQuery);
};
