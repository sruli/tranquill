const { expect } = require('chai');
const sinon = require('sinon');
const ContentBlock = require('../../../src/models/ContentBlock');
const ContentBlockFactory = require('../../../src/services/contentBlocks/ContentBlockFactory');
const ContentBlockKeyGenerator = require('../../../src/services/contentBlocks/ContentBlockKeyGenerator');
const notebookFactory = require('../../factories/notebookFactory');
const contentBlockFactory = require('../../factories/contentBlockFactory');

describe('ContentBlockFactory', () => {
  describe('prototype.create()', () => {
    describe('happy path', () => {
      let notebook;
      let contentBlock;

      beforeEach(async () => {
        notebook = await notebookFactory.create('notebook');
        contentBlock = await contentBlockFactory.build('contentBlock');
      });

      it('creates a contentBlock', () => {
        const block = contentBlock.toObject();

        return expect(
          () => ContentBlockFactory.init({ notebook, block }).create(),
        ).to.alter(
          () => ContentBlock.countDocuments(),
        );
      });
    });

    describe('when a contentBlock exists with the proposed key', () => {
      const duplicateKey = 'c7ppu';
      let notebook;
      let existingContentBlock;
      let newContentBlock;

      beforeEach(async () => {
        notebook = await notebookFactory.create('notebook');
        existingContentBlock = await contentBlockFactory.create('contentBlock', { notebook, key: duplicateKey });
        newContentBlock = await contentBlockFactory.build('contentBlock', { notebook, key: duplicateKey });
      });

      it('saves the new contentBlock with the duplicate key', async () => {
        const block = newContentBlock.toObject();
        newContentBlock = await ContentBlockFactory.init({ notebook, block }).create();

        expect(newContentBlock.key).to.equal(duplicateKey);
      });

      it('changes the key of the existing contentBlock', async () => {
        const block = newContentBlock.toObject();
        await ContentBlockFactory.init({ notebook, block }).create();
        existingContentBlock = await ContentBlock.findById(existingContentBlock.id);

        expect(existingContentBlock.key).to.be.a('string');
        expect(existingContentBlock.key).to.have.lengthOf.above(0);
        expect(existingContentBlock.key).to.not.equal(duplicateKey);
      });

      describe('and maxRetries limit has been exceeded', () => {
        let keyGeneratorSpy;

        beforeEach(() => {
          keyGeneratorSpy = sinon.stub(ContentBlockKeyGenerator.prototype, 'generateRandomKey');
          keyGeneratorSpy.returns(duplicateKey);
        });

        afterEach(async () => {
          keyGeneratorSpy.restore();
        });

        it('raises an error', async () => {
          const createContentBlock = async () => {
            const block = newContentBlock.toObject();
            await ContentBlockFactory.init({ notebook, block }).create();
          };

          return expect(createContentBlock()).to.be.rejectedWith(
            Error,
            `Could not generate unique key for content block for notebook: ${notebook.id}`,
          );
        });
      });
    });
  });
});
