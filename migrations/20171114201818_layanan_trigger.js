exports.up = (knex, Promise) => {
  return Promise.all([
    knex.raw(`
        CREATE TRIGGER after_layanan_insert 
            AFTER INSERT ON layanan
            FOR EACH ROW 
        BEGIN
            DECLARE user_provinsi VARCHAR(255);
            DECLARE user_kota VARCHAR(255);
            DECLARE user_puskesmas VARCHAR(255);

            SELECT username_puskesmas
            INTO   user_puskesmas
            FROM   user_kestrad
            WHERE  username = NEW.username_kestrad;

            SELECT username_kota
            INTO   user_kota
            FROM   user_puskesmas
            WHERE  username = user_puskesmas;

            SELECT username_provinsi
            INTO   user_provinsi
            FROM   user_kota
            WHERE  username = user_kota;

            INSERT INTO layanan_additional
            VALUES (
                NEW.id_layanan,
                user_provinsi,
                user_kota,
                user_puskesmas,
                NEW.username_kestrad,
                0,
                0
            );

            IF (NEW.verified = 'active') THEN
                UPDATE user_provinsi_additional 
                SET    count_layanan_verified = count_layanan_verified + 1 
                WHERE  username = user_provinsi;

                UPDATE user_kota_additional 
                SET    count_layanan_verified = count_layanan_verified + 1 
                WHERE  username = user_kota;

                UPDATE user_puskesmas_additional 
                SET    count_layanan_verified = count_layanan_verified + 1 
                WHERE  username = user_puskesmas;

                UPDATE user_kestrad_additional 
                SET    count_layanan_verified = count_layanan_verified + 1 
                WHERE  username = NEW.username_kestrad;
            ELSE
            UPDATE user_provinsi_additional 
                SET    count_layanan_not_verified = count_layanan_not_verified + 1 
                WHERE  username = user_provinsi;

                UPDATE user_kota_additional 
                SET    count_layanan_not_verified = count_layanan_not_verified + 1 
                WHERE  username = user_kota;

                UPDATE user_puskesmas_additional 
                SET    count_layanan_not_verified = count_layanan_not_verified + 1 
                WHERE  username = user_puskesmas;

                UPDATE user_kestrad_additional 
                SET    count_layanan_not_verified = count_layanan_not_verified + 1 
                WHERE  username = NEW.username_kestrad;
            END IF; 
        END
    `),
    knex.raw(`
        CREATE TRIGGER after_layanan_delete 
            AFTER DELETE ON layanan
            FOR EACH ROW 
        BEGIN
            DECLARE user_provinsi VARCHAR(255);
            DECLARE user_kota VARCHAR(255);
            DECLARE user_puskesmas VARCHAR(255);

            SELECT username_puskesmas
            INTO   user_puskesmas
            FROM   user_kestrad
            WHERE  username = OLD.username_kestrad;

            SELECT username_kota
            INTO   user_kota
            FROM   user_puskesmas
            WHERE  username = user_puskesmas;

            SELECT username_provinsi
            INTO   user_provinsi
            FROM   user_kota
            WHERE  username = user_kota;

            IF (OLD.verified = 'active') THEN
                UPDATE user_provinsi_additional 
                SET    count_layanan_verified = count_layanan_verified - 1 
                WHERE  username = user_provinsi;

                UPDATE user_kota_additional 
                SET    count_layanan_verified = count_layanan_verified - 1 
                WHERE  username = user_kota;

                UPDATE user_puskesmas_additional 
                SET    count_layanan_verified = count_layanan_verified - 1 
                WHERE  username = user_puskesmas;

                UPDATE user_kestrad_additional 
                SET    count_layanan_verified = count_layanan_verified - 1 
                WHERE  username = OLD.username_kestrad;
            ELSE
                UPDATE user_provinsi_additional 
                SET    count_layanan_not_verified = count_layanan_not_verified - 1 
                WHERE  username = user_provinsi;

                UPDATE user_kota_additional 
                SET    count_layanan_not_verified = count_layanan_not_verified - 1 
                WHERE  username = user_kota;

                UPDATE user_puskesmas_additional 
                SET    count_layanan_not_verified = count_layanan_not_verified - 1 
                WHERE  username = user_puskesmas;

                UPDATE user_kestrad_additional 
                SET    count_layanan_not_verified = count_layanan_not_verified - 1 
                WHERE  username = OLD.username_kestrad;
            END IF; 
        END
    `)
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.raw('DROP TRIGGER IF EXISTS after_layanan_insert;'),
    knex.raw('DROP TRIGGER IF EXISTS after_layanan_delete;')
  ]);
};
  