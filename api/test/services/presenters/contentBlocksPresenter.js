const { expect } = require('chai');
const notebookFactory = require('../../factories/notebookFactory');
const contentBlockFactory = require('../../factories/contentBlockFactory');
const ContentBlocksPresenter = require('../../../src/services/presenters/ContentBlocksPresenter');
const timesMap = require('../../helpers/timesMap');

const { API_URL } = process.env;

describe('ContentBlocksPresenter', () => {
  describe('.present()', () => {
    let notebook;

    beforeEach(async () => {
      notebook = await notebookFactory.create('notebook');
      await Promise.all(
        timesMap(6, () => contentBlockFactory.create('contentBlock', { notebook: notebook.id })),
      );
    });

    describe('happy path', () => {
      let contentBlocks;

      beforeEach(async () => {
        contentBlocks = await notebook.contentBlocksQuery({ skip: 2, limit: 2, sort: { position: 'asc' } });
      });

      it('presents the contentBlocks for a notebook', async () => {
        const presented = await ContentBlocksPresenter.init({
          notebook,
          contentBlocks,
          limit: 2,
        }).present();

        expect(presented).to.eql({
          href: `${API_URL}/notebooks/${notebook.id}/contentBlocks?offset=2&limit=2`,
          items: contentBlocks.map(contentBlock => contentBlock.toJSON()),
          total: 6,
          limit: 2,
          offset: 2,
          previous: `${API_URL}/notebooks/${notebook.id}/contentBlocks?offset=0&limit=2`,
          next: `${API_URL}/notebooks/${notebook.id}/contentBlocks?offset=4&limit=2`,
        });
      });
    });

    describe('when the current set of contentBlocks contains the first contentBlock', () => {
      let contentBlocks;

      beforeEach(async () => {
        contentBlocks = await notebook.contentBlocksQuery({ sort: { position: 'asc' } });
      });

      it('sets previous to null', async () => {
        const presented = await ContentBlocksPresenter.init({ notebook, contentBlocks }).present();
        expect(presented.previous).to.be.null;
      });
    });

    describe('when the current set of contentBlocks contains the last contentBlock', () => {
      let contentBlocks;

      beforeEach(async () => {
        contentBlocks = await notebook.contentBlocksQuery({ sort: { position: 'asc' } });
      });

      it('sets next to null', async () => {
        const presented = await ContentBlocksPresenter.init({ notebook, contentBlocks }).present();
        expect(presented.next).to.be.null;
      });
    });

    describe('when current first position is less than the limit', () => {
      let contentBlocks;

      beforeEach(async () => {
        contentBlocks = await notebook.contentBlocksQuery({ skip: 1, limit: 2, sort: { position: 'asc' } });
      });

      it('sets the previous offset to 0', async () => {
        const presented = await ContentBlocksPresenter.init({
          notebook,
          contentBlocks,
          limit: 3,
        }).present();

        expect(presented.previous).to.match(/offset=0/);
      });

      it('sets the previous limit to the current first position', async () => {
        const presented = await ContentBlocksPresenter.init({
          notebook,
          contentBlocks,
          limit: 3,
        }).present();

        expect(presented.previous).to.match(/limit=1/);
      });
    });

    describe('when there are no content blocks', () => {
      it('presents properly', async () => {
        const contentBlocks = [];
        const presented = await ContentBlocksPresenter.init({
          notebook,
          contentBlocks,
        }).present();

        expect(presented).to.eql({
          href: `${API_URL}/notebooks/${notebook.id}/contentBlocks?offset=0&limit=10`,
          items: [],
          total: 6,
          limit: 10,
          offset: 0,
          previous: null,
          next: null,
        });
      });
    });
  });
});
