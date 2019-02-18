const NotebookPresenter = require('./NotebookPresenter');

class NotebooksPresenter {
  static init(args) {
    const notebooksPresenter = new NotebooksPresenter(args);
    return notebooksPresenter;
  }

  constructor({ notebooks }) {
    this.notebooks = notebooks;
  }

  async present() {
    const presentedNotebooks = await Promise.all(
      this.notebooks.map(notebook => NotebookPresenter.init({ notebook }).present()),
    );

    return presentedNotebooks;
  }
}

module.exports = NotebooksPresenter;
