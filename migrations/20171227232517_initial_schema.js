exports.up = async (knex, Promise) => {
  await knex.schema.createTable('users', (t) => {
    t.increments();
    t.string('username');
    t.string('isic');
    t.float('balance');
  });
  await knex.schema.createTable('products', (t) => {
    t.string('barcode').primary();
    t.string('name');
    t.float('price');
    t.integer('stock');
  });
};

exports.down = (knex, Promise) => {

};
