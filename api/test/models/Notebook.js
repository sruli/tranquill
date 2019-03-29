const mongoose = require('mongoose');
const { expect } = require('chai');
const notebookFactory = require('../factories/notebookFactory');
const contentBlockFactory = require('../factories/contentBlockFactory');
const timesMap = require('../helpers/timesMap');

describe('Notebook', () => {
  it('saves a notebook with timestamps', async () => {
    const notebook = await notebookFactory.create('notebook');
    expect(notebook.createdAt).to.exist;
    expect(notebook.updatedAt).to.exist;
  });

  context('when saving a notebook without a name', () => {
    it('raises a ValidationError', () => {
      const noName = async () => {
        await notebookFactory.create('notebook', { name: null });
      };
      return expect(noName()).to.be.rejectedWith(
        mongoose.Error.ValidationError,
        'Path `name` is required.',
      );
    });
  });

  describe('prototype.contentBlocksQuery()', () => {
    describe('happy path', () => {
      let notebook;

      beforeEach(async () => {
        notebook = await notebookFactory.create('notebook');
        await Promise.all(
          timesMap(2, () => contentBlockFactory.create('contentBlock', { notebook })),
        );
      });

      it('retrieves the contentBlocks for a notebook', async () => {
        const contentBlocks = await notebook.contentBlocksQuery();
        expect(contentBlocks).to.have.lengthOf(2);
      });

      it('does not retrieve contentBlocks that belong to a different notebook', async () => {
        const differentNotebook = await notebookFactory.create('notebook');
        await contentBlockFactory.create('contentBlock', { notebook: differentNotebook });

        expect(
          await differentNotebook.contentBlocksQuery(),
        ).to.have.lengthOf(1);

        expect(
          await notebook.contentBlocksQuery(),
        ).to.have.lengthOf(2);
      });
    });

    describe('with options params', () => {
      let notebook;

      beforeEach(async () => {
        notebook = await notebookFactory.create('notebook');
        await contentBlockFactory.create('contentBlock', { notebook, position: 0 });
        await contentBlockFactory.create('contentBlock', { notebook, position: 1 });
      });

      it('returns the contentBlocks based on the option params', async () => {
        const contentBlocks = await notebook.contentBlocksQuery({ options: { limit: 1, sort: { position: 'desc' } } });
        expect(contentBlocks).to.have.lengthOf(1);
        expect(contentBlocks[0].position).to.equal(1);
      });
    });

    describe('with query params', () => {
      let notebook;

      beforeEach(async () => {
        notebook = await notebookFactory.create('notebook');
        await contentBlockFactory.create('contentBlock', { notebook, position: 0 });
        await contentBlockFactory.create('contentBlock', { notebook, position: 1 });
      });

      it('returns the contentBlocks based on the query params', async () => {
        const query = notebook.contentBlocksQuery({ query: { position: 0 } });
        const contentBlocks = await query;
        expect(contentBlocks).to.have.lengthOf(1);
        expect(contentBlocks[0].position).to.equal(0);
      });
    });
  });

  describe('prototype.toJSON()', () => {
    it('renders the notebook as JSON', async () => {
      const notebook = await notebookFactory.create('notebook');
      const { id, name, createdAt, updatedAt } = notebook;

      const expected = {
        id,
        name,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      };

      expect(notebook.toJSON()).to.deep.equal(expected);
    });
  });

  describe('.prototype.touch()', () => {
    it('updates the updatedAt timestamp', async () => {
      const notebook = await notebookFactory.create('notebook');

      return expect(
        () => notebook.touch(),
      ).to.alter(
        () => notebook.updatedAt,
      );
    });
  });
});
