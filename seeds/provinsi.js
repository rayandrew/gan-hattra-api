exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('user_provinsi').del()
    .then(() => {
      let users = [{
        username: 'test1',
        email: 'test1@gmail.com',
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
      let provinsi = [{
        username: 'test1',
        nama_dinas: 'test1',
        kepala_dinas: 'test1',
        alamat: 'test1'
      }];
      return Promise.all([
        // Inserts seed entries
        knex('user_provinsi').insert(provinsi)
      ]);
    });
};