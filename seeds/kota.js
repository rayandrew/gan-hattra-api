exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      return knex('user_provinsi').del();
    })
    .then(() => {
      return knex('user_kota').del();
    })
    .then(() => {
      let users = [{
        username: 'admin',
        email: 'admin@gmail.com',
        password: '$2a$08$QwNk.YBBpry2N09/LVudj.ZvVtkL.6JIYvGd8Y8MT9VQ3mMfHwF8S',
        role: 'admin',
        status: 'active'
      } // Password: admin
      ];
      return Promise.all([
        // Inserts seed entries
        knex('users').insert(users)
      ]);
      })
    .then(() => {
      let users = [{
        username: 'provinsi_bandung',
        email: 'bandung@gmail.com',
        password: '$2a$08$QwNk.YBBpry2N09/LVudj.ZvVtkL.6JIYvGd8Y8MT9VQ3mMfHwF8S',
        role: 'provinsi',
        status: 'active'
      } // Password: admin
      ];
      return Promise.all([
        // Inserts seed entries
        knex('users').insert(users)
      ]);
      })
    .then(() => {
      let users = [{
        username: 'kota_garut',
        email: 'garut@gmail.com',
        password: '$2a$08$QwNk.YBBpry2N09/LVudj.ZvVtkL.6JIYvGd8Y8MT9VQ3mMfHwF8S',
        role: 'kota',
        status: 'active'
      } // Password: admin
      ];
      return Promise.all([
        // Inserts seed entries
        knex('users').insert(users)
      ]);
      })
    .then(() => {
      let provinsi = [{
        username: 'provinsi_bandung',
        nama_provinsi: 'bandung',
        kepala_dinas: 'Ray',
        alamat: 'Jalan rumah Ray'
      } // Password: admin
      ];
      return Promise.all([
        // Inserts seed entries
        knex('user_provinsi').insert(provinsi)
      ]);
      })
    .then(() => {
      let kota = [{
        username: 'kota_garut',
        username_provinsi: 'provinsi_bandung',
        nama_kota: 'garut',
        kepala_dinas: 'HP',
        alamat: 'Jalan rumah HP'
      }];
      return Promise.all([
        // Inserts seed entries
        knex('user_kota').insert(kota)
      ]);
    });
};