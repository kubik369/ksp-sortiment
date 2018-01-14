exports.seed = async (knex, Promise) => {
  try {
    // Deletes ALL existing entries
    await knex('products').del();
    await knex('products').insert([
      {barcode: '8584004040108', name: 'Horalky', price: 0.30, stock: 10},
      {barcode: '8593894907958', name: 'Zlaté Polomáčané - Mliečne', price: 0.50, stock: 15},
    ]);

    await knex('users').del();
    await knex('users').insert([
      {username: 'kubik', isic: '123456', balance: 5.25},
      {username: 'guest', isic: '', balance: 0},
    ]);
  } catch (e) {
    console.error(e);
  }
};
