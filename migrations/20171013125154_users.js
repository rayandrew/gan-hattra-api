exports.up = (knex, Promise) => {
    return Promise.all([
        knex.schema.createTable('users', table => {
            table.string('username').primary();
            table.string('password');
            table.string('email');
            table.string('role');
            table.string('status');
            table.timestamps();
        })
    ]);
};

exports.down = (knex, Promise) => {
    return Promise.all([
        knex.schema.dropTable('users')
    ]);
};