const mongoose = require('mongoose');
const request = require('supertest');
const { expect } = require('chai');
const { OK, NOT_FOUND } = require('http-status');
const app = require('../../../src/app');
const notebookFactory = require('../../factories/notebookFactory');
const { present } = require('../../../src/services/presenters/notebookPresenter');

describe('notebooks routes', () => {
  let notebook;

  describe('GET notebooks/:id', () => {
    context('when the notebook exists', () => {
      beforeEach(async () => {
        notebook = await notebookFactory.create('notebook');
      });

      it('returns a presented notebook', async () => {
        const { body } = await request(app).get(`/v1/notebooks/${notebook.id}`);
        const presented = await present(notebook);
        expect(body).to.deep.equal(presented);
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
