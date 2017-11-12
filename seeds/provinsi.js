exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('user_provinsi')
    .del()
    .then(() => {
      let users = [
        {
          username: 'test1',
          email: 'test1@gmail.com',
          password:
            '$2a$08$iDpnuw9dllsMi5DFKGGIte5zl7HB4OHX4ChFCZDpkxODQlOAxj8Ny',
          role: 'provinsi',
          status: 'active'
        } // Password: password
      ];
      return Promise.all([
        // Inserts seed entries
        knex('users').insert(users)
      ]);
    })
    .then(() => {
      let provinsi = [
        {
          username: 'test1',
          nama_provinsi: 'test1',
          kepala_dinas: 'test1',
          alamat: 'test1'
        }
      ];
      return Promise.all([
        // Inserts seed entries
        knex('user_provinsi').insert(provinsi)
      ]);
    });
};
