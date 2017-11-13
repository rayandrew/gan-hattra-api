exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users')
    .del()
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
