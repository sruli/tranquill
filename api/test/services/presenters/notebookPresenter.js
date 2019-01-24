const { expect } = require('chai');
const notebookFactory = require('../../factories/notebook');
const { present } = require('../../../src/services/presenters/notebookPresenter');
const { present: contentBlocksPresenter } = require('../../../src/services/presenters/contentBlocksPresenter');

const { API_URL } = process.env;

describe('notebookPresenter', () => {
  describe('present', () => {
    it('presents a notebook', async () => {
      const notebook = await notebookFactory.create('notebook');
      const presented = await present(notebook);

      expect(presented).to.deep.equal({
        ...notebook.toJSON(),
        href: `${API_URL}/notebooks/${notebook.id}`,
        contentBlocks: await contentBlocksPresenter(notebook),
      });
    });
  });
});
