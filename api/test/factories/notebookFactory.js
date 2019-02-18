const { factory } = require('factory-girl');
const userFactory = require('./userFactory');
const Notebook = require('../../src/models/Notebook');

factory.define('notebook', Notebook, async () => {
  const user = await userFactory.create('user');

  return {
    user,
    name: 'Notebook',
  };
});

module.exports = factory;
