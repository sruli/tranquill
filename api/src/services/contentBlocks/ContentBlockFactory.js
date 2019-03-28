/**
 * This class handles creating a content block with pagination in mind. DraftJS can only guarantee
 * unique keys for content blocks currently loaded in the browser editor. This means that
 * there could be a content block in the browser whose key is the same as a different content block
 * belonging to same notebook that is not currently loaded in the browser. If this happens, we want
 * to maintain the key for the content block that is currently loaded in the browser so that it will
 * be consistent with DraftJS and generate a new key for the existing content block that is stored
 * in our database.
 */

const ContentBlock = require('../../models/ContentBlock');
const ContentBlockKeyGenerator = require('./ContentBlockKeyGenerator');

const maxRetries = 5;

const keyUniquenessError = function keyUniquenessError(e) {
  return (
    e.name === 'ValidationError'
    && e.message.match(new RegExp(ContentBlock.KEY_UNIQ_ERROR_MSG))
  );
};

const handleDuplicate = async function handleDuplicate(dup, keyGenerator, instance) {
  const factory = instance;

  try {
    dup.set({ key: keyGenerator.generateRandomKey() });
    await dup.save();
  } catch (e) {
    if (keyUniquenessError(e)) {
      if (factory.retries >= factory.maxRetries) {
        // log something
        throw (new Error(`Could not generate unique key for content block for notebook: ${factory.notebook.id}`));
      }
      factory.retries += 1;
      await handleDuplicate(dup, keyGenerator, factory);
    } else {
      throw (e);
    }
  }
};

class ContentBlockFactory {
  static init(args) {
    const contentBlockFactory = new ContentBlockFactory(args);
    return contentBlockFactory;
  }

  constructor({ notebook, block }) {
    this.notebook = notebook;
    this.block = block;
    this.retries = 0;
    this.maxRetries = maxRetries;
  }

  async create() {
    let contentBlock = new ContentBlock({ ...this.block, notebook: this.notebook });

    try {
      contentBlock = await contentBlock.save();
    } catch (e) {
      if (keyUniquenessError(e)) {
        const dup = await ContentBlock.findOne({ notebook: this.notebook, key: contentBlock.key });
        dup.set({ key: '' });
        await dup.save();
        contentBlock = await contentBlock.save();
        await handleDuplicate(dup, ContentBlockKeyGenerator.init(), this);
      } else {
        throw (e);
      }
    }

    return contentBlock;
  }
}

module.exports = ContentBlockFactory;
