const { factory } = require('factory-girl');
const Notebook = require('../../src/models/notebook');

factory.define('notebook', Notebook, {
  name: 'notebook name',
});

factory.extend('notebook', 'noName', {
  name: null,
});

module.exports = factory;
