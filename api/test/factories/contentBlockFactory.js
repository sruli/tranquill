const { factory } = require('factory-girl');
const ContentBlockKeyGenerator = require('../../src/services/contentBlocks/ContentBlockKeyGenerator');
const ContentBlock = require('../../src/models/ContentBlock');
const notebookFactory = require('./notebookFactory');

factory.define('contentBlock', ContentBlock, async () => {
  const notebook = await notebookFactory.create('notebook');

  return {
    notebook,
    key: ContentBlockKeyGenerator.init().generateRandomKey(),
    text: 'Some text',
    type: 'unstyled',
    depth: 0,
    inlineStyleRanges: [],
    entityRanges: [],
    data: {},
    position: factory.sequence('ContentBlock.position', n => n - 1),
  };
});

module.exports = factory;
