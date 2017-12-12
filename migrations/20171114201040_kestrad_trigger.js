exports.up = (knex, Promise) => {
  return Promise.all([
    knex.raw(`
        CREATE TRIGGER after_user_kestrad_insert 
            AFTER INSERT ON user_kestrad
            FOR EACH ROW 
        BEGIN
            DECLARE user_provinsi VARCHAR(255);
            DECLARE user_kota VARCHAR(255);

            SELECT username_kota
            INTO   user_kota
            FROM   user_puskesmas
            WHERE  username = NEW.username_puskesmas;

            SELECT username_provinsi
            INTO   user_provinsi
            FROM   user_kota
            WHERE  username = user_kota;

            INSERT INTO user_kestrad_additional
            VALUES (
                NEW.username,
                user_provinsi,
                user_kota,
                NEW.username_puskesmas,
                0,
                0,
                0,
                0
            );

            UPDATE user_provinsi_additional 
            SET    count_kestrad = count_kestrad + 1 
            WHERE  username = user_provinsi;

            UPDATE user_kota_additional 
            SET    count_kestrad = count_kestrad + 1 
            WHERE  username = user_kota;

            UPDATE user_puskesmas_additional 
            SET    count_kestrad = count_kestrad + 1 
            WHERE  username = NEW.username_puskesmas;
        END
    `),
    knex.raw(`
        CREATE TRIGGER before_user_kestrad_delete
            BEFORE DELETE ON user_kestrad
            FOR EACH ROW
        BEGIN
            DELETE
            FROM hattra
            WHERE id_layanan IN
                (SELECT id_layanan
                FROM layanan
                WHERE username_kestrad = OLD.username);
            DELETE
            FROM layanan
            WHERE username_kestrad = OLD.username;
        END
    `),
    knex.raw(`
        CREATE TRIGGER after_user_kestrad_delete 
            AFTER DELETE ON user_kestrad
            FOR EACH ROW 
        BEGIN
            DECLARE user_provinsi VARCHAR(255);
            DECLARE user_kota VARCHAR(255);

            SELECT username_kota
            INTO   user_kota
            FROM   user_puskesmas
            WHERE  username = OLD.username_puskesmas;

            SELECT username_provinsi
            INTO   user_provinsi
            FROM   user_kota
            WHERE  username = user_kota;

            UPDATE user_provinsi_additional 
            SET    count_kestrad = count_kestrad - 1 
            WHERE  username = user_provinsi;

            UPDATE user_kota_additional 
            SET    count_kestrad = count_kestrad - 1 
            WHERE  username = user_kota;

            UPDATE user_puskesmas_additional 
            SET    count_kestrad = count_kestrad - 1 
            WHERE  username = OLD.username_puskesmas;

            DELETE FROM users
            WHERE username = OLD.username;
        END
    `)
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.raw('DROP TRIGGER IF EXISTS after_user_kestrad_insert;'),
    knex.raw('DROP TRIGGER IF EXISTS before_user_kestrad_delete;'),
    knex.raw('DROP TRIGGER IF EXISTS after_user_kestrad_delete;')
  ]);
};
