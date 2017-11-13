exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('user_kestrad_additional', table => {
      table
        .string('username')
        .primary()
        .references('user_kestrad.username')
        .onDelete('CASCADE');
      table.integer('count_hattra_verified').defaultTo(0);
      table.integer('count_hattra_not_verified').defaultTo(0);
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([knex.schema.dropTable('user_hattra_additional')]);
};
