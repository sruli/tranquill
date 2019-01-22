const { expect } = require('chai');
const notebookFactory = require('../factories/notebook');
const contentBlockFactory = require('../factories/contentBlock');
const ContentBlock = require('../../src/models/ContentBlock');

describe('contentBlock', () => {
  context('when instantiated with a notebook', () => {
    let notebook;

    beforeEach(async () => {
      notebook = await notebookFactory.create('notebook');
    });

    it('creates a contentBlock', async () => {
      await expect(
        () => contentBlockFactory.create('contentBlock', { notebook }),
      ).to.alter(
        () => ContentBlock.countDocuments(),
      );
    });

    it('saves the correct notebook', async () => {
      const { id } = await contentBlockFactory.create('contentBlock', { notebook });
      const contentBlock = await ContentBlock.findById(id);

      expect(String(contentBlock.notebook)).to.equal(String(notebook.id));
    });
  });
});
