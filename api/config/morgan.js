const morganConfig = {
  development: ['dev'],
  test: ['dev', { skip: () => true }],
};

module.exports = morganConfig[process.env.NODE_ENV];
