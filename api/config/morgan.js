const morganConfig = {
  development: ['dev'],
  test: ['dev', { skip: () => true }],
  production: ['combined'],
  staging: ['combined'],
};

module.exports = morganConfig[process.env.NODE_ENV];
