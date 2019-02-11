const { expect } = require('chai');
const notebookFactory = require('../../factories/notebookFactory');
const NotebookPresenter = require('../../../src/services/presenters/NotebookPresenter');
const { present: contentBlocksPresenter } = require('../../../src/services/presenters/contentBlocksPresenter');

const { API_URL } = process.env;

describe('NotebookPresenter', () => {
  describe('prototype.present()', () => {
    it('presents a notebook', async () => {
      const notebook = await notebookFactory.create('notebook');
      const presented = await NotebookPresenter.init({ notebook }).present();

      expect(presented).to.deep.equal({
        ...notebook.toJSON(),
        href: `${API_URL}/notebooks/${notebook.id}`,
        contentBlocks: await contentBlocksPresenter(notebook),
      });
    });
  });
});
