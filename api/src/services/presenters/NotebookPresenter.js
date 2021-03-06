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
      const options = { limit: ContentBlock.FETCH_LIMIT_DEFAULT, sort: { position: 'desc' } };
      const contentBlocks = await this.notebook
        .contentBlocksQuery({ options })
        .then(blocks => blocks.reverse());

      presented.contentBlocks = await ContentBlocksPresenter.init({
        contentBlocks,
        notebook: this.notebook,
      }).present();
    }

    return presented;
  }
}

module.exports = NotebookPresenter;
