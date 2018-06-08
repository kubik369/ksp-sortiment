
exports.up = async (knex, Promise) => {
  await knex.schema.createTable('logs', (t) => {
    t.increments();
    t.integer('user_id').unsigned();
    t.foreign('user_id').references('users.id');
    t.json('log');
    t.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
};

exports.down = async (knex, Promise) => {
  await knex.schema.dropTable('logs');
};
