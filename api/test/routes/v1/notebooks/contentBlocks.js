const mongoose = require('mongoose');
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const { ACCEPTED, NOT_FOUND, UNPROCESSABLE_ENTITY } = require('http-status');
const app = require('../../../../src/app');
const ContentBlocksPersistenceManager = require('../../../../src/services/ContentBlocksPersistenceManager');
const notebookFactory = require('../../../factories/notebook');

describe('contentBlocks routes', () => {
  describe('POST /notebooks/:id/contentBlocks', () => {
    context('happy path', () => {
      let notebook;
      let persistenceManagerSpy;
      let response;

      beforeEach(async () => {
        persistenceManagerSpy = sinon.stub(ContentBlocksPersistenceManager.prototype, 'manage');
        notebook = await notebookFactory.create('notebook');
        response = await request(app)
          .post(`/v1/notebooks/${notebook.id}/contentBlocks`)
          .send({ blocks: [{}, {}, {}] })
          .accept('Accept', 'application/json');
      });

      afterEach(() => {
        sinon.restore();
      });

      it('manages the persistence of the blocks', async () => {
        expect(persistenceManagerSpy).to.have.been.called;
      });

      it('returns ACCEPTED status', () => {
        expect(response.statusCode).to.equal(ACCEPTED);
      });
    });

    context('when the notebook could not be found', () => {
      let response;

      beforeEach(async () => {
        response = await request(app)
          .post(`/v1/notebooks/${mongoose.Types.ObjectId()}/contentBlocks`)
          .send({ blocks: [{}] })
          .accept('Accept', 'application/json');
      });

      it('returns NOT_FOUND status', () => {
        const { statusCode } = response;
        expect(statusCode).to.equal(NOT_FOUND);
      });

      it('provides an error message', () => {
        const { message } = response.body;
        expect(message).to.match(/Could not find notebook/);
      });
    });

    context('when no blocks param is provided', () => {
      let response;

      beforeEach(async () => {
        const notebook = await notebookFactory.create('notebook');
        response = await request(app)
          .post(`/v1/notebooks/${notebook.id}/contentBlocks`)
          .accept('Accept', 'application/json');
      });

      it('returns UNPROCESSABLE_ENTITY status', () => {
        const { statusCode } = response;
        expect(statusCode).to.equal(UNPROCESSABLE_ENTITY);
      });

      it('provides an error message', () => {
        const { message } = response.body;
        expect(message).to.equal('Request must contain an array of blocks');
      });
    });

    context('when blocks param is not an array', () => {
      let response;

      beforeEach(async () => {
        const notebook = await notebookFactory.create('notebook');
        response = await request(app)
          .post(`/v1/notebooks/${notebook.id}/contentBlocks`)
          .send({ blocks: 'wrong value' })
          .accept('Accept', 'application/json');
      });

      it('returns UNPROCESSABLE_ENTITY status', () => {
        const { statusCode } = response;
        expect(statusCode).to.equal(UNPROCESSABLE_ENTITY);
      });

      it('provides an error message', () => {
        const { message } = response.body;
        expect(message).to.equal('Request must contain an array of blocks');
      });
    });
  });
});
