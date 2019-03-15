const mongoose = require('mongoose');
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { ACCEPTED, NOT_FOUND, BAD_REQUEST } = require('http-status');
const Notebook = require('../../../../src/models/Notebook');
const ContentBlocksPersistenceManager = require('../../../../src/services/ContentBlocksPersistenceManager');
const notebookFactory = require('../../../factories/notebookFactory');
const { stubMiddleware } = require('../../../helpers/stubMiddleware');

const app = stubMiddleware({
  './notebooks/contentBlocks': proxyquire('../../../../src/routes/v1/notebooks/contentBlocks', {
    '../../../middlewares/ensureAuthentication': (req, res, next) => next(),
  }),
});

describe('contentBlocks routes', () => {
  describe('POST /notebooks/:id/contentBlocks', () => {
    context('happy path', () => {
      let notebook;
      let persistenceManagerSpy;

      const makeRequest = function makeRequest() {
        return request(app)
          .post(`/v1/notebooks/${notebook.id}/contentBlocks`)
          .send({ blocks: [{}, {}, {}] })
          .accept('Accept', 'application/json');
      };

      beforeEach(async () => {
        persistenceManagerSpy = sinon.stub(ContentBlocksPersistenceManager.prototype, 'manage');
        notebook = await notebookFactory.create('notebook');
      });

      afterEach(async () => {
        persistenceManagerSpy.restore();
      });

      it('manages the persistence of the blocks', async () => {
        await makeRequest();
        expect(persistenceManagerSpy).to.have.been.called;
      });

      it('updates the updatedAt of the notebook', async () => {
        const queryUpdatedAt = async () => {
          const { updatedAt } = await Notebook.findById(notebook.id);
          return updatedAt;
        };

        return expect(
          () => makeRequest(),
        ).to.alter(
          () => queryUpdatedAt(),
        );
      });

      it('returns ACCEPTED status', async () => {
        const { statusCode } = await makeRequest();
        expect(statusCode).to.equal(ACCEPTED);
      });
    });

    context('when a user has more than one notebook', () => {
      let notebook2;
      let persistenceManagerSpy;

      const makeRequest = function makeRequest() {
        return request(app)
          .post(`/v1/notebooks/${notebook2.id}/contentBlocks`)
          .send({ blocks: [{}, {}, {}] })
          .accept('Accept', 'application/json');
      };

      beforeEach(async () => {
        persistenceManagerSpy = sinon.stub(ContentBlocksPersistenceManager.prototype, 'manage');
        await notebookFactory.create('notebook');
        notebook2 = await notebookFactory.create('notebook');
      });

      afterEach(async () => {
        persistenceManagerSpy.restore();
      });

      it('updates the updatedAt of the correct notebook', async () => {
        const queryUpdatedAt = async () => {
          const { updatedAt } = await Notebook.findById(notebook2.id);
          return updatedAt;
        };

        return expect(
          () => makeRequest(),
        ).to.alter(
          () => queryUpdatedAt(),
        );
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

      it('returns BAD_REQUEST status', () => {
        const { statusCode } = response;
        expect(statusCode).to.equal(BAD_REQUEST);
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

      it('returns BAD_REQUEST status', () => {
        const { statusCode } = response;
        expect(statusCode).to.equal(BAD_REQUEST);
      });

      it('provides an error message', () => {
        const { message } = response.body;
        expect(message).to.equal('Request must contain an array of blocks');
      });
    });
  });
});
