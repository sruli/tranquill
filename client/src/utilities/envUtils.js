const devEnv = function devEnv() {
  return process.env.REACT_APP_ENV === 'development';
};

const prodEnv = function prodEnv() {
  return process.env.REACT_APP_ENV === 'production';
};

const stagingEnv = function stagingEnv() {
  return process.env.REACT_APP_ENV === 'staging';
};

module.exports = { devEnv, prodEnv, stagingEnv };
