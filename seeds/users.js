exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => {
      let users = [
        {
          username: 'admin',
          email: 'admin@e-gov.id',
          password: '$2a$08$QwNk.YBBpry2N09/LVudj.ZvVtkL.6JIYvGd8Y8MT9VQ3mMfHwF8S',
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
