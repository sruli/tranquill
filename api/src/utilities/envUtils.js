const devEnv = function devEnv() {
  return process.env.NODE_ENV === 'development';
};

module.exports = { devEnv };
