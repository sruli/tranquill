const { present: presentContentBlocks } = require('./contentBlocksPresenter');

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
      presented.contentBlocks = await presentContentBlocks(this.notebook);
    }

    return presented;
  }
}

module.exports = NotebookPresenter;
