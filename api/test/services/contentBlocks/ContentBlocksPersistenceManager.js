const { expect } = require('chai');
const ContentBlock = require('../../../src/models/ContentBlock');
const ContentBlocksPersistenceManager = require('../../../src/services/contentBlocks/ContentBlocksPersistenceManager');
const notebookFactory = require('../../factories/notebookFactory');
const contentBlockFactory = require('../../factories/contentBlockFactory');
const timesMap = require('../../helpers/timesMap');

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

      it('creates new contentBlocks for blocks that do not yet exist', () => (
        expect(
          () => ContentBlocksPersistenceManager.init({
            notebook,
            blocks,
            options: { offset: 0 },
          }).manage(),
        ).to.alter(
          () => ContentBlock.countDocuments(),
          { by: 1 },
        )
      ));

      it('updates contentBlocks that already exist', async () => {
        const options = { offset: 0 };
        await ContentBlocksPersistenceManager.init({ notebook, blocks, options }).manage();
        const { id } = contentBlock;
        contentBlock = await ContentBlock.findById(id);
        expect(contentBlock.text).to.equal('New text');
      });
    });

    context('when contentBlocks have been deleted', () => {
      let notebook;
      let blocks;

      beforeEach(async () => {
        notebook = await notebookFactory.create('notebook');
        await Promise.all(
          timesMap(3, () => contentBlockFactory.create('contentBlock', { notebook })),
        );
        const contentBlock = await notebook.contentBlocksQuery({ query: { position: 1 } })
          .then(results => results[0]);
        blocks = [{ ...contentBlock.toObject(), text: 'New text' }];
        await ContentBlocksPersistenceManager.init({
          notebook,
          blocks,
          options: { offset: 1 },
        }).manage();
      });

      it('deletes those contentBlocks from the database', async () => {
        const deletedBlock = await notebook.contentBlocksQuery({ query: { position: 2 } })
          .then(results => results[0]);
        expect(deletedBlock).to.be.undefined;
      });

      it('does not delete contentBlocks that were updated', async () => {
        const existingBlock = await notebook.contentBlocksQuery({ query: { position: 1 } })
          .then(results => results[0]);
        expect(existingBlock).to.exist;
      });

      it('does not delete contentBlocks whose position is lower than the offset', async () => {
        const ignoredBlock = await notebook.contentBlocksQuery({ query: { position: 0 } })
          .then(results => results[0]);
        expect(ignoredBlock).to.exist;
      });
    });

    context('when no starting position is provided', () => {
      it('raises an error', () => {
        expect(
          () => ContentBlocksPersistenceManager.init({ notebook: {}, blocks: [] }).manage(),
        ).to.throw(TypeError, 'Invalid arguments: `options.offset` must be an integer');
      });
    });
  });
});
