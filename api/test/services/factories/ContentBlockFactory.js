const { expect } = require('chai');
const ContentBlockFactory = require('../../../src/services/factories/ContentBlockFactory');
const ContentBlock = require('../../../src/models/ContentBlock');
const notebookFactory = require('../../factories/notebook');
const contentBlockFactory = require('../../factories/contentBlock');

describe('contentBlock factory service', () => {
  describe('ContentBlockFactory.init()', () => {
    let notebook;
    let factory;

    beforeEach(async () => {
      notebook = await notebookFactory.create('notebook');
      factory = await ContentBlockFactory.init(notebook);
    });

    it('returns a ContentBlockFactory', async () => {
      expect(factory.constructor.name).to.equal('ContentBlockFactory');
    });

    it('fetches the contentBlocks for a notebook', async () => {
      const contentBlocks = await notebook.contentBlocks();
      expect(factory.contentBlocks).to.have.lengthOf(contentBlocks.length);
    });
  });

  describe('ContentBlockFactory.prototype.createOrUpdate()', () => {
    context('when contentBlock does not exist', () => {
      let factory;

      beforeEach(async () => {
        const notebook = await notebookFactory.create('notebook');
        factory = await ContentBlockFactory.init(notebook);
      });

      it('creates a new contentBlock', async () => {
        await expect(
          () => factory.createOrUpdate({}),
        ).to.alter(
          () => ContentBlock.countDocuments(),
          { by: 1 },
        );
      });
    });

    context('when contentBlock exists', () => {
      let factory;
      let contentBlock;
      let newAttrs;

      beforeEach(async () => {
        const notebook = await notebookFactory.create('notebook');
        contentBlock = await contentBlockFactory.create('contentBlock', { notebook });
        factory = await ContentBlockFactory.init(notebook);
        newAttrs = { ...contentBlock.toObject(), text: 'New text' };
      });

      it('does not create a new contentBlock', async () => {
        await expect(
          () => factory.createOrUpdate(newAttrs),
        ).not.to.alter(
          () => ContentBlock.countDocuments(),
        );
      });

      it('updates the existing contentBlock', async () => {
        await factory.createOrUpdate(newAttrs);
        contentBlock = await ContentBlock.findById(contentBlock.id);
        expect(contentBlock.text).to.equal('New text');
      });
    });

    context('when factory was not created with ContentBlockFactory.init()', () => {
      it('raises an exception', async () => {
        const notebook = await notebookFactory.create('notebook');
        const factory = new ContentBlockFactory(notebook);
        expect(
          factory.createOrUpdate({}),
        ).to.be.rejectedWith(TypeError, "Cannot read property 'find' of null");
      });
    });
  });
});
