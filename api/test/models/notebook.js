const mongoose = require('mongoose');
const { expect } = require('chai');
const notebookFactory = require('../factories/notebook');
const contentBlockFactory = require('../factories/contentBlock');

describe('Notebook', () => {
  it('saves a notebook with timestamps', async () => {
    const notebook = await notebookFactory.create('notebook');
    expect(notebook.createdAt).to.exist;
    expect(notebook.updatedAt).to.exist;
  });

  context('when saving a notebook without a name', () => {
    it('raises a ValidationError', () => {
      const noName = async () => {
        await notebookFactory.create('noName');
      };
      expect(noName()).to.be.rejectedWith(mongoose.Error.ValidationError);
    });

    it('specifies that name is required', async () => {
      try {
        await notebookFactory.create('noName');
        throw new Error('Force an exeption so that expectations execute no matter what.');
      } catch (e) {
        expect(e.errors).to.have.property('name');
        expect(e.errors.name.message).to.equal('Path `name` is required.');
      }
    });
  });

  describe('prototype.contentBlocks()', () => {
    let notebook;

    beforeEach(async () => {
      notebook = await notebookFactory.create('notebook');
      await Promise.all([...Array(2).keys()].map(() => (
        contentBlockFactory.create('contentBlock', { notebook })
      )));
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
