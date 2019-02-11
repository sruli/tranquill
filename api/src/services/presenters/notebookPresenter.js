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

  async present() {
    return {
      ...this.notebook.toJSON(),
      href: `${API_URL}/notebooks/${this.notebook.id}`,
      contentBlocks: await presentContentBlocks(this.notebook),
    };
  }
}

module.exports = NotebookPresenter;
