exports.up = (knex, Promise) => {
  return Promise.all([
    knex.raw(`
        CREATE TRIGGER after_user_kota_insert 
            AFTER INSERT ON user_kota
            FOR EACH ROW 
        BEGIN
            INSERT INTO user_kota_additional
            VALUES (
                NEW.username,
                NEW.username_provinsi,
                0,
                0,
                0,
                0,
                0,
                0
            );

            UPDATE user_provinsi_additional 
            SET    count_kota = count_kota + 1 
            WHERE  username = NEW.username_provinsi;
        END
    `),
    knex.raw(`
        CREATE TRIGGER after_user_kota_delete 
            AFTER DELETE ON user_kota
            FOR EACH ROW 
        BEGIN
            UPDATE user_provinsi_additional 
            SET count_kota = count_kota - 1 
            WHERE username = OLD.username_provinsi;

            DELETE FROM users
            WHERE username = OLD.username;
        END
    `)
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.raw('DROP TRIGGER IF EXISTS after_user_kota_insert;'),
    knex.raw('DROP TRIGGER IF EXISTS after_user_kota_delete;')
  ]);
};
