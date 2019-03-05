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

  describe('prototype.contentBlocks()', () => {
    describe('happy path', () => {
      let notebook;

      beforeEach(async () => {
        notebook = await notebookFactory.create('notebook');
        await Promise.all(
          timesMap(2, () => contentBlockFactory.create('contentBlock', { notebook })),
        );
      });

      it('retrieves the contentBlocks for a notebook', async () => {
        const contentBlocks = await notebook.contentBlocks();
        expect(contentBlocks).to.have.lengthOf(2);
      });

      it('does not retrieve contentBlocks that belong to a different notebook', async () => {
        const differentNotebook = await notebookFactory.create('notebook');
        await contentBlockFactory.create('contentBlock', { notebook: differentNotebook });

        expect(
          await differentNotebook.contentBlocks(),
        ).to.have.lengthOf(1);

        expect(
          await notebook.contentBlocks(),
        ).to.have.lengthOf(2);
      });
    });

    describe('when contentBlocks are created out of order', () => {
      let notebook;

      beforeEach(async () => {
        notebook = await notebookFactory.create('notebook');
        await contentBlockFactory.create('contentBlock', { notebook, position: 1 });
        await contentBlockFactory.create('contentBlock', { notebook, position: 0 });
      });

      it('returns them in their proper order', async () => {
        const contentBlocks = await notebook.contentBlocks();
        expect(
          contentBlocks.map(contentBlock => contentBlock.position),
        ).to.deep.equal([0, 1]);
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
});
