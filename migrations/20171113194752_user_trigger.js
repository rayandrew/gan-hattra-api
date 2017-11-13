exports.up = (knex, Promise) => {
  return Promise.all([
    knex.raw(`
        CREATE TRIGGER after_users_insert 
            AFTER INSERT ON users
            FOR EACH ROW 
        BEGIN
            IF (NEW.role = "provinsi") THEN
                INSERT INTO user_provinsi
                VALUES (
                    NEW.username,
                    NEW.username,
                    null,
                    null
                );
            END IF;
        END
    `),
    // knex.raw(`
    //     CREATE TRIGGER after_users_delete
    //         AFTER DELETE ON users
    //         FOR EACH ROW 
    //     BEGIN
    //         UPDATE user_provinsi_additional 
    //         SET count_kota = count_kota - 1 
    //         WHERE username = OLD.username_provinsi;
    //     END
    // `)
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.raw('DROP TRIGGER IF EXISTS after_user_kota_insert;'),
    knex.raw('DROP TRIGGER IF EXISTS after_user_kota_delete;')
  ]);
};
  