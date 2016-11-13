var config = {
  dev: process.env.DEV || false,
  port: process.env.PORT || 3000,
  database: 'sortiment.sqlite',
};

module.exports = config;
module.exports.default = config;
