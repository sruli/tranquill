const mongoose = require('mongoose');
const { expect } = require('chai');
const { connectDB } = require('../../src/utilities/mongodbUtils');
const Notebook = require('../../src/models/notebook');

describe('Notebook', () => {
  before(() => connectDB());

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });

  it('saves a notebook with timestamps', (done) => {
    const notebook = new Notebook({});
    notebook.save(() => {
      expect(notebook.createdAt).to.exist
      expect(notebook.updatedAt).to.exist
      done();
    });
  });
});
