exports.seed = (knex, Promise) => {
  let provinsiQuery = () => {
    return knex('user_provinsi')
      .then(() => {
        let users = [
          {
            username: 'jawa_barat_provinsi',
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
            username: 'jawa_barat_provinsi',
            nama: 'jawa_barat',
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
            username: 'tasik_kota',
            email: 'tasik_kota@e-gov.id',
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
            username_kota: 'tasik',
            nama: 'datafreaksPuskesmas',
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

  return knex('users')
    .del()
    .then(provinsiQuery)
    .then(kotaQuery)
    .then(puskesmasQuery);
};
