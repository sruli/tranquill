const path = require('path');
const { Polly } = require('@pollyjs/core');

const instantiatePolly = function instantiatePolly({ name }) {
  if (!name) throw (new Error('Supply a name'));

  return new Polly(name, {
    adapters: ['node-http'],
    persister: 'fs',
    persisterOptions: {
      fs: {
        recordingsDir: path.join(__dirname, '../recordings'),
      },
    },
    recordFailedRequests: true,
  });
};

module.exports = {
  instantiatePolly,
};
