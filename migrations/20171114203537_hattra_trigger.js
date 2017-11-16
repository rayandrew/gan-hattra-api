exports.up = (knex, Promise) => {
  return Promise.all([
    knex.raw(`
        CREATE TRIGGER after_hattra_insert 
            AFTER INSERT ON hattra
            FOR EACH ROW 
        BEGIN
            DECLARE user_provinsi VARCHAR(255);
            DECLARE user_kota VARCHAR(255);
            DECLARE user_puskesmas VARCHAR(255);
            DECLARE user_kestrad VARCHAR(255);

            SELECT username_kestrad
            INTO   user_kestrad
            FROM   layanan
            WHERE  id_layanan = NEW.id_layanan;

            SELECT username_puskesmas
            INTO   user_puskesmas
            FROM   user_kestrad
            WHERE  username = user_kestrad;

            SELECT username_kota
            INTO   user_kota
            FROM   user_puskesmas
            WHERE  username = user_puskesmas;

            SELECT username_provinsi
            INTO   user_provinsi
            FROM   user_kota
            WHERE  username = user_kota;

            INSERT INTO hattra_additional
            VALUES (
                NEW.id_hattra,
                user_provinsi,
                user_kota,
                user_puskesmas,
                user_kestrad,
                NEW.id_layanan
            );

            IF (NEW.verified = 'active') THEN
                UPDATE user_provinsi_additional 
                SET    count_hattra_verified = count_hattra_verified + 1 
                WHERE  username = user_provinsi;

                UPDATE user_kota_additional 
                SET    count_hattra_verified = count_hattra_verified + 1 
                WHERE  username = user_kota;

                UPDATE user_puskesmas_additional 
                SET    count_hattra_verified = count_hattra_verified + 1 
                WHERE  username = user_puskesmas;

                UPDATE user_kestrad_additional 
                SET    count_hattra_verified = count_hattra_verified + 1 
                WHERE  username = user_kestrad;

                UPDATE layanan_additional 
                SET    count_hattra_verified = count_hattra_verified + 1 
                WHERE  id_layanan = NEW.id_layanan;
            ELSE
                UPDATE user_provinsi_additional 
                SET    count_hattra_not_verified = count_hattra_not_verified + 1 
                WHERE  username = user_provinsi;

                UPDATE user_kota_additional 
                SET    count_hattra_not_verified = count_hattra_not_verified + 1 
                WHERE  username = user_kota;

                UPDATE user_puskesmas_additional 
                SET    count_hattra_not_verified = count_hattra_not_verified + 1 
                WHERE  username = user_puskesmas;

                UPDATE user_kestrad_additional 
                SET    count_hattra_not_verified = count_hattra_not_verified + 1 
                WHERE  username = user_kestrad;

                UPDATE layanan_additional 
                SET    count_hattra_not_verified = count_hattra_not_verified + 1 
                WHERE  id_layanan = NEW.id_layanan;
            END IF; 
        END
    `),
    knex.raw(`
        CREATE TRIGGER after_hattra_delete 
            AFTER DELETE ON hattra
            FOR EACH ROW 
        BEGIN
            DECLARE user_provinsi VARCHAR(255);
            DECLARE user_kota VARCHAR(255);
            DECLARE user_puskesmas VARCHAR(255);
            DECLARE user_kestrad VARCHAR(255);

            SELECT username_kestrad
            INTO   user_kestrad
            FROM   layanan
            WHERE  id_layanan = OLD.id_layanan;

            SELECT username_puskesmas
            INTO   user_puskesmas
            FROM   user_kestrad
            WHERE  username = user_kestrad;

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
                SET    count_hattra_verified = count_hattra_verified - 1 
                WHERE  username = user_provinsi;

                UPDATE user_kota_additional 
                SET    count_hattra_verified = count_hattra_verified - 1 
                WHERE  username = user_kota;

                UPDATE user_puskesmas_additional 
                SET    count_hattra_verified = count_hattra_verified - 1 
                WHERE  username = user_puskesmas;

                UPDATE user_kestrad_additional 
                SET    count_hattra_verified = count_hattra_verified - 1 
                WHERE  username = user_kestrad;

                UPDATE layanan_additional 
                SET    count_hattra_verified = count_hattra_verified - 1 
                WHERE  id_layanan = OLD.id_layanan;
            ELSE
                UPDATE user_provinsi_additional 
                SET    count_hattra_not_verified = count_hattra_not_verified - 1 
                WHERE  username = user_provinsi;

                UPDATE user_kota_additional 
                SET    count_hattra_not_verified = count_hattra_not_verified - 1 
                WHERE  username = user_kota;

                UPDATE user_puskesmas_additional 
                SET    count_hattra_not_verified = count_hattra_not_verified - 1 
                WHERE  username = user_puskesmas;

                UPDATE user_kestrad_additional 
                SET    count_hattra_not_verified = count_hattra_not_verified - 1 
                WHERE  username = user_kestrad;

                UPDATE layanan_additional 
                SET    count_hattra_not_verified = count_hattra_not_verified - 1 
                WHERE  id_layanan = OLD.id_layanan;
            END IF; 
        END
    `),
    knex.raw(`
        CREATE TRIGGER after_hattra_update
            AFTER UPDATE ON hattra
            FOR EACH ROW 
        BEGIN
            DECLARE user_provinsi VARCHAR(255);
            DECLARE user_kota VARCHAR(255);
            DECLARE user_puskesmas VARCHAR(255);
            DECLARE user_kestrad VARCHAR(255);

            SELECT username_kestrad
            INTO   user_kestrad
            FROM   layanan
            WHERE  id_layanan = OLD.id_layanan;

            SELECT username_puskesmas
            INTO   user_puskesmas
            FROM   user_kestrad
            WHERE  username = user_kestrad;

            SELECT username_kota
            INTO   user_kota
            FROM   user_puskesmas
            WHERE  username = user_puskesmas;

            SELECT username_provinsi
            INTO   user_provinsi
            FROM   user_kota
            WHERE  username = user_kota;

            IF (OLD.verified <> 'active' AND NEW.verified = 'active') THEN
                UPDATE  user_provinsi_additional 
                SET     count_hattra_verified = count_hattra_verified + 1,
                        count_hattra_not_verified = count_hattra_not_verified - 1  
                WHERE   username = user_provinsi;

                UPDATE  user_kota_additional 
                SET     count_hattra_verified = count_hattra_verified + 1,
                        count_hattra_not_verified = count_hattra_not_verified - 1   
                WHERE   username = user_kota;

                UPDATE  user_puskesmas_additional 
                SET     count_hattra_verified = count_hattra_verified + 1,
                        count_hattra_not_verified = count_hattra_not_verified - 1  
                WHERE   username = user_puskesmas;

                UPDATE  user_kestrad_additional 
                SET     count_hattra_verified = count_hattra_verified + 1,
                        count_hattra_not_verified = count_hattra_not_verified - 1  
                WHERE   username = user_kestrad;

                UPDATE  layanan_additional 
                SET     count_hattra_verified = count_hattra_verified + 1,
                        count_hattra_not_verified = count_hattra_not_verified - 1   
                WHERE   id_layanan = OLD.id_layanan;
            ELSEIF (OLD.verified = 'active' AND NEW.verified <> 'active') THEN
                UPDATE  user_provinsi_additional 
                SET     count_hattra_verified = count_hattra_verified - 1,
                        count_hattra_not_verified = count_hattra_not_verified + 1  
                WHERE   username = user_provinsi;

                UPDATE  user_kota_additional 
                SET     count_hattra_verified = count_hattra_verified - 1,
                        count_hattra_not_verified = count_hattra_not_verified + 1  
                WHERE   username = user_kota;

                UPDATE  user_puskesmas_additional 
                SET     count_hattra_verified = count_hattra_verified - 1,
                        count_hattra_not_verified = count_hattra_not_verified + 1  
                WHERE   username = user_puskesmas;

                UPDATE  user_kestrad_additional 
                SET     count_hattra_verified = count_hattra_verified - 1,
                        count_hattra_not_verified = count_hattra_not_verified + 1   
                WHERE   username = user_kestrad;

                UPDATE  layanan_additional 
                SET     count_hattra_verified = count_hattra_verified - 1,
                        count_hattra_not_verified = count_hattra_not_verified + 1   
                WHERE   id_layanan = OLD.id_layanan;
            END IF; 
        END
    `)
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.raw('DROP TRIGGER IF EXISTS after_hattra_insert;'),
    knex.raw('DROP TRIGGER IF EXISTS after_hattra_delete;')
  ]);
};
