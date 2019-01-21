const ContentBlock = require('../../models/contentBlock');

class ContentBlockFactory {
  static async init(notebook) {
    const contentBlockFactory = new ContentBlockFactory(notebook);
    contentBlockFactory.contentBlocks = await notebook.contentBlocks();
    return contentBlockFactory;
  }

  // Prefer ContentBlockFactory.init() over instantiating with `new`
  constructor(notebook) {
    this.notebook = notebook;
    this.contentBlocks = null;
  }

  /**
   * TODO: After pagination, ensure that the content block key is unique per
   * notebook since draftjs only ensures that keys are unique for the loaded
   * editorState. It is not aware of additional content blocks stored in the db.
   */
  async createOrUpdate(block) {
    let contentBlock = this.contentBlocks.find(({ key }) => (
      key === block.key
    ));

    if (contentBlock) {
      contentBlock.set(block);
    } else {
      const { notebook } = this;
      contentBlock = new ContentBlock({ ...block, notebook });
    }
    await contentBlock.save();
  }
}

module.exports = ContentBlockFactory;
