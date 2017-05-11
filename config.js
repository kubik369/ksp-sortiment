const config = {
  dev: process.env.DEV || false,
  port: process.env.PORT || 3000,
};

module.exports = config;
module.exports.default = config;
