const { expect } = require('chai');
const ContentBlock = require('../../src/models/ContentBlock');
const ContentBlocksPersistenceManager = require('../../src/services/ContentBlocksPersistenceManager');
const notebookFactory = require('../factories/notebookFactory');
const contentBlockFactory = require('../factories/contentBlockFactory');

describe('ContentBlocksPersistenceManager', () => {
  describe('prototype.manage()', () => {
    context('happy path', () => {
      let notebook;
      let contentBlock;
      let blocks;

      beforeEach(async () => {
        notebook = await notebookFactory.create('notebook');
        contentBlock = await contentBlockFactory.create('contentBlock', { notebook });
        const builtBlock = await contentBlockFactory.build('contentBlock', { notebook });
        blocks = [
          builtBlock.toObject(),
          { ...contentBlock.toObject(), text: 'New text' },
        ];
      });

      it('creates new contentBlocks for blocks that do not exist yet', async () => {
        await expect(
          () => ContentBlocksPersistenceManager.init({ notebook, blocks }).manage(),
        ).to.alter(
          () => ContentBlock.countDocuments(),
          { by: 1 },
        );
      });

      it('updates contentBlocks that already exist', async () => {
        await ContentBlocksPersistenceManager.init({ notebook, blocks }).manage();
        const { id } = contentBlock;
        contentBlock = await ContentBlock.findById(id);
        expect(contentBlock.text).to.equal('New text');
      });
    });

    context('when contentBlocks have been deleted', () => {
      let notebook;
      let contentBlocks;
      let blocks;

      beforeEach(async () => {
        notebook = await notebookFactory.create('notebook');
        contentBlocks = await Promise.all(
          [...Array(2).keys()].map(() => (
            contentBlockFactory.create('contentBlock', { notebook })
          )),
        );
        blocks = [{ ...contentBlocks[0].toObject(), text: 'New text' }];
      });

      it('deletes those contentBlocks from the database', async () => {
        await ContentBlocksPersistenceManager.init({ notebook, blocks }).manage();
        const deletedBlock = await ContentBlock.findById(contentBlocks[1].id);
        expect(deletedBlock).to.be.null;
      });

      it('does not delete blocks that were updated', async () => {
        await ContentBlocksPersistenceManager.init({ notebook, blocks }).manage();
        const existingBlock = await ContentBlock.findById(contentBlocks[0].id);
        expect(existingBlock).to.exist;
      });
    });
  });
});
