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
  };
},
{
  afterBuild: async function setPosition(model, options) {
    const contentBlock = model;
    const { position } = options;

    if (Number.isInteger(position)) {
      contentBlock.position = position;
    } else {
      const { notebook } = contentBlock;
      contentBlock.position = await ContentBlock.find({ notebook }).countDocuments();
    }

    return contentBlock;
  },
});

module.exports = factory;
