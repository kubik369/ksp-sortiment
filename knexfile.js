// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './sortiment.sqlite',
    },
    seeds: {
      directory: './seeds',
    },
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: './sortiment.sqlite',
    },
  },
};
