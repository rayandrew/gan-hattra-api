exports.seed = (knex, Promise) => {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(() => {
            return knex('user_puskesmas').del();
        })
        .then(() => {
            let users = [{
                    username: 'puskesmas_tasik',
                    email: 'puskesmas_tasik@e-gov.id',
                    password: '$2a$08$QwNk.YBBpry2N09/LVudj.ZvVtkL.6JIYvGd8Y8MT9VQ3mMfHwF8S',
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
            let puskesmas = [{
                username: 'puskesmas_tasik',
                nama_kota: 'tasik',
                nama: 'puskesmas_tasik',
                nama_dinas: 'dinasDump',
                kepala_dinas: 'Adrian',
                alamat: 'Jalan Ranggagempol no.10'
            }];
            return Promise.all([
                // Inserts seed entries
                knex('user_puskesmas').insert(puskesmas)
            ]);
        });
};