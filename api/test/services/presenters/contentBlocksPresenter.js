const { expect } = require('chai');
const notebookFactory = require('../../factories/notebook');
const contentBlockFactory = require('../../factories/contentBlock');
const { present } = require('../../../src/services/presenters/contentBlocksPresenter');

const { API_URL } = process.env;

describe('contentBlocksPresenter', () => {
  describe('.present()', () => {
    let notebook;
    let contentBlock;

    beforeEach(async () => {
      notebook = await notebookFactory.create('notebook');
      contentBlock = await contentBlockFactory.create('contentBlock', { notebook: notebook.id });
    });

    it('presents the contentBlocks for a notebook', async () => {
      const presented = await present(notebook);
      expect(presented).to.deep.equal({
        href: `${API_URL}/notebooks/${notebook.id}/contentBlocks`,
        items: [contentBlock.toJSON()],
      });
    });
  });
});
