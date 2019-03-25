const { API_URL } = process.env;

class ContentBlocksPresenter {
  static init(args) {
    const contentBlocksPresenter = new ContentBlocksPresenter(args);
    return contentBlocksPresenter;
  }

  constructor({ notebook }) {
    this.notebook = notebook;
  }

  async present() {
    const contentBlocks = await this.notebook.contentBlocks();

    return {
      href: `${API_URL}/notebooks/${this.notebook.id}/contentBlocks`,
      items: contentBlocks.map(contentBlock => contentBlock.toJSON()),
    };
  }
}

module.exports = ContentBlocksPresenter;
