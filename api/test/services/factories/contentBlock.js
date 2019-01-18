const { expect } = require('chai');
const { createOrUpdate } = require('../../../src/services/factories/contentBlock');
const ContentBlock = require('../../../src/models/contentBlock');
const notebookFactory = require('../../factories/notebook');
const contentBlockFactory = require('../../factories/contentBlock');

describe('contentBlock factory service', () => {
  describe('createOrUpdate()', () => {
    let notebook;

    beforeEach(async () => {
      notebook = await notebookFactory.create('notebook');
    });

    context('when contentBlock does not exist', () => {
      it('creates a new contentBlock', async () => {
        await expect(
          () => createOrUpdate(notebook, {}),
        ).to.alter(
          () => ContentBlock.countDocuments(),
        );
      });
    });

    context('when contentBlock exists', () => {
      let contentBlock;
      let newAttrs;

      beforeEach(async () => {
        contentBlock = await contentBlockFactory.create('contentBlock');
        newAttrs = { ...contentBlock.toObject(), text: 'New text' };
      });

      it('does not create a new contentBlock', async () => {
        await expect(
          () => createOrUpdate(notebook, newAttrs),
        ).not.to.alter(
          () => ContentBlock.countDocuments(),
        );
      });

      it('updates the existing contentBlock', async () => {
        await createOrUpdate(notebook, newAttrs);
        contentBlock = await ContentBlock.findById(contentBlock.id);
        expect(contentBlock.text).to.equal('New text');
      });
    });
  });
});
