const mongoose = require('mongoose');
const { expect } = require('chai');
const notebookFactory = require('../factories/notebook');

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
});
