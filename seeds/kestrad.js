exports.seed = (knex, Promise) => {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(() => {
            return knex('user_kestrad').del();
        })
        .then(() => {
            let users = [{
                    username: 'kestrad_tasik',
                    email: 'kestrad_tasik@e-gov.id',
                    password: '$2a$08$QwNk.YBBpry2N09/LVudj.ZvVtkL.6JIYvGd8Y8MT9VQ3mMfHwF8S',
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
            let kestrad = [{
                username: 'kestrad_tasik',
                nama_kota: 'tasik',
                nama: 'kestrad_tasik',
                nama_dinas: 'dinasDump',
                kepala_dinas: 'Adrian',
                alamat: 'Jalan Ranggagempol no.10'
            }];
            return Promise.all([
                // Inserts seed entries
                knex('user_kestrad').insert(kestrad)
            ]);
        });
};