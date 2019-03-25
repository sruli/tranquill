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
    const { notebook } = this;
    const presented = {
      ...notebook.toJSON(),
      href: `${API_URL}/notebooks/${notebook.id}`,
    };

    if (includeContentBlocks) {
      presented.contentBlocks = await ContentBlocksPresenter.init({ notebook }).present();
    }

    return presented;
  }
}

module.exports = NotebookPresenter;
