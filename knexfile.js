// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './sortiment.sqlite',
    },
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: './sortiment.sqlite',
    },
  },
};
