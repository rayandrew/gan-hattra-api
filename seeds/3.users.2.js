exports.seed = (knex, Promise) => {
  let puskesmasQuery = () => {
    return knex('user_puskesmas')
      .then(() => {
        let users = [
          {
            username: 'pusk_bunda',
            email: 'pusk_bunda@e-gov.id',
            password:
              '$2y$10$ZHHUNAuXs2/fhHq/UH.eP.wlu3daJsSjnxR0SUCH0G.t.u23W.W9a',
            role: 'puskesmas',
            status: 'active'
          } // Password: pusk_bunda
        ];
        return Promise.all([
          // Inserts seed entries
          knex('users').insert(users)
        ]);
      })
      .then(() => {
        let puskesmas = [
          {
            username: 'pusk_bunda',
            username_kota: 'kota_parapat',
            nama: 'datafreaksPuskesmas3',
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
              '$2y$10$bHoste1uoRi/1eon8nkmAOVco5uvSklQ1eGpy9LibSj0GoPqQgrym',
            role: 'kestrad',
            status: 'active'
          } // Password: kestrad_bunda
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
            username_puskesmas: 'pusk_bunda',
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
