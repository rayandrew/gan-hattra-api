exports.up = (knex, Promise) => {
  return Promise.all([
    knex.raw(`
        CREATE TRIGGER after_user_provinsi_insert 
            AFTER INSERT ON user_provinsi
            FOR EACH ROW 
        BEGIN
            INSERT INTO user_provinsi_additional
            VALUES (
                NEW.username,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            );
        END
    `),
    knex.raw(`
        CREATE TRIGGER after_user_provinsi_delete 
            AFTER DELETE ON user_provinsi
            FOR EACH ROW 
        BEGIN
            DELETE FROM users
            WHERE username = OLD.username;
        END
    `)
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.raw('DROP TRIGGER IF EXISTS after_user_provinsi_insert;'),
    knex.raw('DROP TRIGGER IF EXISTS after_user_provinsi_delete;')
  ]);
};
