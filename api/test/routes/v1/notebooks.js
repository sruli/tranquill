const mongoose = require('mongoose');
const request = require('supertest');
const { expect } = require('chai');
const { OK, NOT_FOUND } = require('http-status');
const Notebook = require('../../../src/models/notebook');
const app = require('../../../src/app');
const { connectDB, closeDB, dropDB } = require('../../../src/utilities/mongodbUtils');

describe('notebookRoutes', () => {
  let notebook;

  before(() => connectDB());
  after(() => closeDB());
  beforeEach(() => dropDB());

  describe('GET notebooks/:id', () => {
    context('when the notebook exists', () => {
      beforeEach(async () => {
        notebook = await Notebook.create({ name: 'First notebook' });
      });

      it('returns the notebook', async () => {
        const { name } = notebook;
        const { body } = await request(app).get(`/v1/notebooks/${notebook.id}`);
        expect(body).to.deep.equal({ name });
      });

      it('returns OK status', async () => {
        const { statusCode } = await request(app).get(`/v1/notebooks/${notebook.id}`);
        expect(statusCode).to.equal(OK);
      });
    });

    context('when the notebook does not exist', () => {
      it('returns NOT FOUND status', async () => {
        const fakeId = mongoose.Types.ObjectId();
        const { statusCode } = await request(app).get(`/v1/notebooks/${fakeId}`);
        expect(statusCode).to.equal(NOT_FOUND);
      });
    });
  });
});
