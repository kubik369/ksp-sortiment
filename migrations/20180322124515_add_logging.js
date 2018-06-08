
exports.up = async (knex, Promise) => {
  await knex.schema.createTable('logs', (t) => {
    t.increments();
    t.integer('user_id').unsigned();
    t.foreign('user_id').references('users.id');
    t.string('log');
    t.timestamps();
  });
};

exports.down = async (knex, Promise) => {
  await knex.schema.dropTable('logs');
};
