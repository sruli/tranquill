const { expect } = require('chai');
const mongoose = require('mongoose');
const notebookFactory = require('../factories/notebookFactory');
const contentBlockFactory = require('../factories/contentBlockFactory');
const ContentBlock = require('../../src/models/ContentBlock');

describe('contentBlock', () => {
  context('key validation', () => {
    let notebook;

    beforeEach(async () => {
      notebook = await notebookFactory.create('notebook');
    });

    it('validates key uniqueness on create', async () => {
      const createWithDuplicateKey = async () => {
        await contentBlockFactory.create('contentBlock', { notebook, key: 'dup' });
      };

      await contentBlockFactory.create('contentBlock', { notebook, key: 'dup' });

      expect(createWithDuplicateKey()).to.be.rejectedWith(
        mongoose.Error.ValidationError,
        'Key has already been taken.',
      );
    });
  });

  context('when instantiated with a notebook', () => {
    let notebook;

    beforeEach(async () => {
      notebook = await notebookFactory.create('notebook');
    });

    it('creates a contentBlock', async () => (
      expect(
        () => contentBlockFactory.create('contentBlock', { notebook }),
      ).to.alter(
        () => ContentBlock.countDocuments(),
      )
    ));

    it('saves the correct notebook', async () => {
      const { id } = await contentBlockFactory.create('contentBlock', { notebook });
      const contentBlock = await ContentBlock.findById(id);

      expect(String(contentBlock.notebook)).to.equal(String(notebook.id));
    });
  });

  describe('prototype.toJSON()', () => {
    it('returns the contentBlock as JSON', async () => {
      const contentBlock = await contentBlockFactory.create('contentBlock');
      const {
        notebook,
        key,
        text,
        type,
        depth,
        inlineStyleRanges,
        entityRanges,
        data,
        position,
        createdAt,
        updatedAt,
      } = contentBlock;

      expect(contentBlock.toJSON()).to.deep.equal({
        notebook,
        key,
        text,
        type,
        depth,
        inlineStyleRanges,
        entityRanges,
        data,
        position,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      });
    });
  });
});
