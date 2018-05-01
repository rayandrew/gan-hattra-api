exports.up = (knex, Promise) => {
  return Promise.all([
    knex.raw(`
        CREATE TRIGGER after_user_puskesmas_insert 
            AFTER INSERT ON user_puskesmas
            FOR EACH ROW 
        BEGIN
            DECLARE user_provinsi VARCHAR(255);

            SELECT username_provinsi
            INTO   user_provinsi
            FROM   user_kota
            WHERE  username = NEW.username_kota;

            INSERT INTO user_puskesmas_additional
            VALUES (
                NEW.username,
                user_provinsi,
                NEW.username_kota,
                0,
                0,
                0,
                0,
                0
            );

            UPDATE user_provinsi_additional 
            SET    count_puskesmas = count_puskesmas + 1 
            WHERE  username = user_provinsi;

            UPDATE user_kota_additional 
            SET    count_puskesmas = count_puskesmas + 1 
            WHERE  username = NEW.username_kota;
        END
    `),
    knex.raw(`
        CREATE TRIGGER before_user_puskesmas_delete
            BEFORE DELETE ON user_puskesmas
            FOR EACH ROW
        BEGIN
            DELETE
            FROM hattra
            WHERE id_layanan IN
                (SELECT id_layanan
                FROM layanan
                WHERE username_kestrad IN (SELECT username
                    FROM user_kestrad
                    WHERE username_puskesmas = OLD.username));

            DELETE
            FROM layanan
            WHERE username_kestrad IN (SELECT username
                FROM user_kestrad
                WHERE username_puskesmas = OLD.username);

            DELETE
            FROM user_kestrad
            WHERE username_puskesmas = OLD.username;
        END
    `),
    knex.raw(`
        CREATE TRIGGER after_user_puskesmas_delete 
            AFTER DELETE ON user_puskesmas
            FOR EACH ROW 
        BEGIN
            DECLARE user_provinsi VARCHAR(255);

            SELECT username_provinsi
            INTO   user_provinsi
            FROM   user_kota
            WHERE  username = OLD.username_kota;

            UPDATE user_provinsi_additional 
            SET count_puskesmas = count_puskesmas - 1 
            WHERE username = user_provinsi;

            UPDATE user_kota_additional 
            SET    count_puskesmas = count_puskesmas - 1 
            WHERE  username = OLD.username_kota;

            DELETE FROM users
            WHERE username = OLD.username;
        END
    `)
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.raw('DROP TRIGGER IF EXISTS after_user_puskesmas_insert;'),
    knex.raw('DROP TRIGGER IF EXISTS before_user_puskesmas_delete;'),
    knex.raw('DROP TRIGGER IF EXISTS after_user_puskesmas_delete;')
  ]);
};
