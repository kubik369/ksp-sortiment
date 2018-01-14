const config = {
  dev: process.env.DEV || false,
  port: process.env.PORT || 3000,
  imagePath: './images/',
};

module.exports = config;
module.exports.default = config;
