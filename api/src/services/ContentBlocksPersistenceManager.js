const findKey = require('lodash/findKey');
const ContentBlock = require('../models/ContentBlock');

class ContentBlocksPersistenceManager {
  static init(args) {
    const manager = new ContentBlocksPersistenceManager(args);
    return manager;
  }

  constructor({ notebook, blocks }) {
    this.notebook = notebook;
    this.blocks = blocks;
  }

  async manage() {
    let existingBlocks = { ...await this.notebook.contentBlocksQuery() };

    await Promise.all(this.blocks.map((block) => {
      const existingKey = findKey(existingBlocks, ({ key }) => key === block.key);

      if (existingKey === undefined) {
        const { notebook } = this;
        const contentBlock = new ContentBlock({ ...block, notebook });
        return contentBlock.save();
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
