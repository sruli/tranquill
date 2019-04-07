const findKey = require('lodash/findKey');
const ContentBlock = require('../../models/ContentBlock');
const ContentBlockFactory = require('./ContentBlockFactory');

class ContentBlocksPersistenceManager {
  static init(args) {
    const manager = new ContentBlocksPersistenceManager(args);
    return manager;
  }

  constructor({ notebook, blocks, options = {} }) {
    if (!Number.isInteger(options.offset)) {
      throw (new TypeError('Invalid arguments: `options.offset` must be an integer'));
    }

    this.notebook = notebook;
    this.blocks = blocks;
    this.offset = options.offset;
  }

  async manage() {
    const query = { position: { $gte: this.offset } };
    let existingBlocks = { ...await this.notebook.contentBlocksQuery({ query }) };

    await Promise.all(this.blocks.map((block) => {
      const existingKey = findKey(existingBlocks, ({ key }) => key === block.key);

      if (existingKey === undefined) {
        return ContentBlockFactory.init({ block, notebook: this.notebook }).create();
      }

      const { [existingKey]: contentBlock, ...rest } = existingBlocks;
      existingBlocks = rest;
      contentBlock.set(block);
      return contentBlock.save();
    }));

    const ids = Object.values(existingBlocks).map(({ id }) => id);
    if (ids.length) await ContentBlock.deleteMany({ _id: { $in: ids } });
  }
}

module.exports = ContentBlocksPersistenceManager;
