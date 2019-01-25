const { factory } = require('factory-girl');
const ContentBlock = require('../../src/models/ContentBlock');
const notebookFactory = require('./notebook');

factory.define('contentBlock', ContentBlock, async () => {
  const notebook = await notebookFactory.create('notebook');

  return {
    notebook,
    key: '5b3s0',
    text: 'Some text',
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
    data: {},
  };
});

module.exports = factory;
