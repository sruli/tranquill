const { factory } = require('factory-girl');
const User = require('../../src/models/User');

factory.define('user', User, {
  email: factory.sequence('User.email', n => `email${n}@example.com`),
});

module.exports = factory;
