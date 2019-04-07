const mongoose = require('mongoose');
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const { ACCEPTED, NOT_FOUND, BAD_REQUEST, OK } = require('http-status');
const Notebook = require('../../../../src/models/Notebook');
const ContentBlock = require('../../../../src/models/ContentBlock');
const ContentBlocksPersistenceManager = require('../../../../src/services/contentBlocks/ContentBlocksPersistenceManager');
const userFactory = require('../../../factories/userFactory');
const notebookFactory = require('../../../factories/notebookFactory');
const contentBlockFactory = require('../../../factories/contentBlockFactory');
const { stubMiddleware, ensureAuthenticationStub } = require('../../../helpers/stubMiddleware');
const timesMap = require('../../../helpers/timesMap');

const stubContentBlocksMiddleware = function stubContentBlocksMiddleware({ ensureAuthentication }) {
  const app = stubMiddleware({
    './notebooks/contentBlocks': proxyquire('../../../../src/routes/v1/notebooks/contentBlocks', {
      '../../../middlewares/ensureAuthentication': ensureAuthentication,
    }),
  });

  return app;
};

describe('contentBlocks routes', () => {
  describe('GET /notebooks/:id/contentBlocks', () => {
    describe('happy path', () => {
      let app;
      let notebook;

      beforeEach(async () => {
        const user = await userFactory.create('user');
        notebook = await notebookFactory.create('notebook', { user });
        await Promise.all(timesMap(3, i => contentBlockFactory.create('contentBlock', { notebook, position: i })));
        app = stubContentBlocksMiddleware({ ensureAuthentication: ensureAuthenticationStub(user) });
      });

      it('returns contentBlocks', async () => {
        const { body: { items } } = await request(app).get(`/v1/notebooks/${notebook.id}/contentBlocks?offset=1&limit=2`);
        expect(items).to.have.lengthOf(2);
        expect(items[0].position).to.equal(1);
      });

      it('returns OK status', async () => {
        const { statusCode } = await request(app).get(`/v1/notebooks/${notebook.id}/contentBlocks?offset=1&limit=2`);
        expect(statusCode).to.equal(OK);
      });
    });

    describe('when no offset and no limit are specified', () => {
      let app;
      let notebook;

      beforeEach(async () => {
        const user = await userFactory.create('user');
        notebook = await notebookFactory.create('notebook', { user });
        await Promise.all(timesMap(3, i => contentBlockFactory.create('contentBlock', { notebook, position: i })));
        app = stubContentBlocksMiddleware({ ensureAuthentication: ensureAuthenticationStub(user) });
      });

      it('returns content blocks based on the default offset and limit', async () => {
        const { body } = await request(app).get(`/v1/notebooks/${notebook.id}/contentBlocks`);
        expect(body.items).to.have.lengthOf(3);
        expect(body.offset).to.equal(0);
        expect(body.limit).to.equal(ContentBlock.FETCH_LIMIT_DEFAULT);
      });
    });

    describe('when no notebook is found', () => {
      let app;

      beforeEach(async () => {
        const user = await userFactory.create('user');
        const notebook = await notebookFactory.create('notebook', { user });
        await Promise.all(timesMap(3, i => contentBlockFactory.create('contentBlock', { notebook, position: i })));
        app = stubContentBlocksMiddleware({ ensureAuthentication: ensureAuthenticationStub(user) });
      });

      it('returns NOT_FOUND status', async () => {
        const response = await request(app).get(`/v1/notebooks/${mongoose.Types.ObjectId()}/contentBlocks`);
        expect(response.statusCode).to.equal(NOT_FOUND);
      });
    });
  });

  describe('POST /notebooks/:id/contentBlocks', () => {
    context('happy path', () => {
      let user;
      let notebook;
      let persistenceManagerSpy;

      const makeRequest = function makeRequest() {
        const ensureAuthentication = ensureAuthenticationStub(user);
        const app = stubContentBlocksMiddleware({ ensureAuthentication });
        return request(app)
          .post(`/v1/notebooks/${notebook.id}/contentBlocks?offset=0`)
          .send({ blocks: [{}, {}, {}] })
          .accept('Accept', 'application/json');
      };

      beforeEach(async () => {
        user = await userFactory.create('user');
        notebook = await notebookFactory.create('notebook', { user });
        persistenceManagerSpy = sinon.stub(ContentBlocksPersistenceManager.prototype, 'manage');
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
      let user;
      let notebook2;
      let persistenceManagerSpy;

      const makeRequest = function makeRequest() {
        const ensureAuthentication = ensureAuthenticationStub(user);
        const app = stubContentBlocksMiddleware({ ensureAuthentication });
        return request(app)
          .post(`/v1/notebooks/${notebook2.id}/contentBlocks`)
          .send({ blocks: [{}, {}, {}] })
          .accept('Accept', 'application/json');
      };

      beforeEach(async () => {
        persistenceManagerSpy = sinon.stub(ContentBlocksPersistenceManager.prototype, 'manage');
        user = await userFactory.create('user');
        await notebookFactory.create('notebook', { user });
        notebook2 = await notebookFactory.create('notebook', { user });
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
        const user = await userFactory.create('user');
        const ensureAuthentication = ensureAuthenticationStub(user);
        const app = stubContentBlocksMiddleware({ ensureAuthentication });
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
        const user = await userFactory.create('user');
        const notebook = await notebookFactory.create('notebook', { user });
        const ensureAuthentication = ensureAuthenticationStub(user);
        const app = stubContentBlocksMiddleware({ ensureAuthentication });
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
        const user = await userFactory.create('user');
        const notebook = await notebookFactory.create('notebook', { user });
        const ensureAuthentication = ensureAuthenticationStub(user);
        const app = stubContentBlocksMiddleware({ ensureAuthentication });
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

    context('when offset isNil()', () => {
      let response;

      beforeEach(async () => {
        const user = await userFactory.create('user');
        const notebook = await notebookFactory.create('notebook', { user });
        const ensureAuthentication = ensureAuthenticationStub(user);
        const app = stubContentBlocksMiddleware({ ensureAuthentication });
        response = await request(app)
          .post(`/v1/notebooks/${notebook.id}/contentBlocks`)
          .send({ blocks: [] })
          .accept('Accept', 'application/json');
      });

      it('returns BAD_REQUEST status', () => {
        const { statusCode } = response;
        expect(statusCode).to.equal(BAD_REQUEST);
      });

      it('provides an error message', () => {
        const { message } = response.body;
        expect(message).to.equal('Request must contain an offset with an Integer value');
      });
    });

    context('when offset is not a number', () => {
      let response;

      beforeEach(async () => {
        const user = await userFactory.create('user');
        const notebook = await notebookFactory.create('notebook', { user });
        const ensureAuthentication = ensureAuthenticationStub(user);
        const app = stubContentBlocksMiddleware({ ensureAuthentication });
        response = await request(app)
          .post(`/v1/notebooks/${notebook.id}/contentBlocks?offset=notanumber`)
          .send({ blocks: [] })
          .accept('Accept', 'application/json');
      });

      it('returns BAD_REQUEST status', () => {
        const { statusCode } = response;
        expect(statusCode).to.equal(BAD_REQUEST);
      });

      it('provides an error message', () => {
        const { message } = response.body;
        expect(message).to.equal('Request must contain an offset with an Integer value');
      });
    });
  });
});
