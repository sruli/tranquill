const { expect } = require('chai');
const notebookFactory = require('../../factories/notebookFactory');
const contentBlockFactory = require('../../factories/contentBlockFactory');
const NotebookPresenter = require('../../../src/services/presenters/NotebookPresenter');
const ContentBlocksPresenter = require('../../../src/services/presenters/ContentBlocksPresenter');

const { API_URL } = process.env;

describe('NotebookPresenter', () => {
  describe('prototype.present()', () => {
    it('presents a notebook', async () => {
      const notebook = await notebookFactory.create('notebook');
      const presented = await NotebookPresenter.init({ notebook }).present();

      expect(presented).to.eql({
        ...notebook.toJSON(),
        href: `${API_URL}/notebooks/${notebook.id}`,
      });
    });

    context('when includeContentBlocks option is true', () => {
      it('includes the contentBlocks for the notebook', async () => {
        const notebook = await notebookFactory.create('notebook');
        const presented = await NotebookPresenter
          .init({ notebook })
          .present({ includeContentBlocks: true });

        expect(presented).to.eql({
          ...notebook.toJSON(),
          href: `${API_URL}/notebooks/${notebook.id}`,
          contentBlocks: await ContentBlocksPresenter.init({
            notebook,
            contentBlocks: [],
          }).present(),
        });
      });

      it('includes the contentBlocks in their correct order', async () => {
        const notebook = await notebookFactory.create('notebook');
        const contentBlock1 = await contentBlockFactory.create('contentBlock', { notebook: notebook.id });
        const contentBlock2 = await contentBlockFactory.create('contentBlock', { notebook: notebook.id });
        const presented = await NotebookPresenter
          .init({ notebook })
          .present({ includeContentBlocks: true });

        expect(presented).to.eql({
          ...notebook.toJSON(),
          href: `${API_URL}/notebooks/${notebook.id}`,
          contentBlocks: await ContentBlocksPresenter.init({
            notebook,
            contentBlocks: [contentBlock1, contentBlock2],
          }).present(),
        });
      });
    });
  });
});
