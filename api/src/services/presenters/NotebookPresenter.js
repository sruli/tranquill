const ContentBlock = require('../../models/ContentBlock');
const ContentBlocksPresenter = require('./ContentBlocksPresenter');

const { API_URL } = process.env;

class NotebookPresenter {
  static init(args) {
    const notebookPresenter = new NotebookPresenter(args);
    return notebookPresenter;
  }

  constructor({ notebook }) {
    this.notebook = notebook;
  }

  async present({ includeContentBlocks = false } = {}) {
    const presented = {
      ...this.notebook.toJSON(),
      href: `${API_URL}/notebooks/${this.notebook.id}`,
    };

    if (includeContentBlocks) {
      const queryOptions = { limit: ContentBlock.FETCH_LIMIT_DEFAULT, sort: { position: 'desc' } };
      const contentBlocks = await this.notebook
        .contentBlocksQuery(queryOptions)
        .then(blocks => blocks.reverse());

      const contentBlocksPresenter = ContentBlocksPresenter.init({
        contentBlocks,
        notebook: this.notebook,
      });

      presented.contentBlocks = await contentBlocksPresenter.present();
    }

    return presented;
  }
}

module.exports = NotebookPresenter;
