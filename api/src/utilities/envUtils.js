const devEnv = function devEnv() {
  return process.env.NODE_ENV === 'development';
};

const testEnv = function testEnv() {
  return process.env.NODE_ENV === 'test';
};

module.exports = { devEnv, testEnv };
