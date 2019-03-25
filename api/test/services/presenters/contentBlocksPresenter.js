const { expect } = require('chai');
const notebookFactory = require('../../factories/notebookFactory');
const contentBlockFactory = require('../../factories/contentBlockFactory');
const ContentBlocksPresenter = require('../../../src/services/presenters/ContentBlocksPresenter');

const { API_URL } = process.env;

describe('ContentBlocksPresenter', () => {
  describe('.present()', () => {
    let notebook;
    let contentBlock;

    beforeEach(async () => {
      notebook = await notebookFactory.create('notebook');
      contentBlock = await contentBlockFactory.create('contentBlock', { notebook: notebook.id });
    });

    it('presents the contentBlocks for a notebook', async () => {
      const presented = await ContentBlocksPresenter.init({ notebook }).present();
      expect(presented).to.deep.equal({
        href: `${API_URL}/notebooks/${notebook.id}/contentBlocks`,
        items: [contentBlock.toJSON()],
      });
    });
  });
});
