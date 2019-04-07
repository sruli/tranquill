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
          timesMap(3, i => contentBlockFactory.create('contentBlock', { notebook, position: i })),
        );
        const block = await notebook.contentBlocksQuery({ query: { position: 1 } }).findOne();
        blocks = [{ ...block.toObject(), text: 'New text' }];
        await ContentBlocksPersistenceManager.init({
          notebook,
          blocks,
          options: { offset: 1 },
        }).manage();
      });

      it('deletes those contentBlocks from the database', async () => {
        const deleted = await notebook.contentBlocksQuery({ query: { position: 2 } }).findOne();
        expect(deleted).to.be.null;
      });

      it('does not delete contentBlocks that were updated', async () => {
        const existing = await notebook.contentBlocksQuery({ query: { position: 1 } }).findOne();
        expect(existing).to.exist;
      });

      it('does not delete contentBlocks whose position is lower than the offset', async () => {
        const ignored = await notebook.contentBlocksQuery({ query: { position: 0 } }).findOne();
        expect(ignored).to.exist;
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
