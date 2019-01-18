const mongoose = require('mongoose');
const request = require('supertest');
const { expect } = require('chai');
const { OK, NOT_FOUND } = require('http-status');
const app = require('../../../src/app');
const notebookFactory = require('../../factories/notebook');

describe('notebooks routes', () => {
  let notebook;

  describe('GET notebooks/:id', () => {
    context('when the notebook exists', () => {
      beforeEach(async () => {
        notebook = await notebookFactory.create('notebook');
      });

      it('returns the notebook', async () => {
        const { id, name } = notebook;
        const { body } = await request(app).get(`/v1/notebooks/${notebook.id}`);
        expect(body).to.deep.equal({ name, id });
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
