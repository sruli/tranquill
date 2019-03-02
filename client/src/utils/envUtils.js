const devEnv = function devEnv() {
  return process.env.NODE_ENV === 'development';
};

const prodEnv = function prodEnv() {
  return process.env.NODE_ENV === 'production';
};

module.exports = { devEnv, prodEnv };
