const mongoose = require('mongoose');
const request = require('supertest');
const { expect } = require('chai');
const { OK, NOT_FOUND, BAD_REQUEST } = require('http-status');
const proxyquire = require('proxyquire');
const url = require('url');
const userFactory = require('../../factories/userFactory');
const notebookFactory = require('../../factories/notebookFactory');
const NotebookPresenter = require('../../../src/services/presenters/NotebookPresenter');
const { stubMiddleware, defaultMiddlewareFunc } = require('../../helpers/stubMiddleware');

const stubNotebooksMiddleware = function stubNotebooksMiddleware({ ensureAuthentication } = {}) {
  const app = stubMiddleware({
    './notebooks': proxyquire('../../../src/routes/v1/notebooks', {
      '../../middlewares/ensureAuthentication': ensureAuthentication || defaultMiddlewareFunc,
    }),
  });

  return app;
};


describe('notebooks routes', () => {
  describe('GET /notebooks', () => {
    let app;
    let notebooks;

    beforeEach(async () => {
      const user = await userFactory.create('user');
      notebooks = await Promise.all([
        notebookFactory.create('notebook', { user, name: 'a' }),
        notebookFactory.create('notebook', { user, name: 'b' }),
        notebookFactory.create('notebook', { user, name: 'c' }),
      ]);

      app = stubNotebooksMiddleware({
        ensureAuthentication: (req, res, next) => {
          req.userId = user.id;
          return next();
        },
      });
    });

    it('responds with OK status', async () => {
      const { statusCode } = await request(app).get('/v1/notebooks');
      expect(statusCode).to.equal(OK);
    });

    it('gets notebooks', async () => {
      const { body } = await request(app).get('/v1/notebooks');
      expect(
        body.map(({ id }) => id).sort(),
      ).to.eql(
        notebooks.map(({ id }) => id).sort(),
      );
    });

    context('with sort param', () => {
      it('returns the notebooks in the specified order', async () => {
        const queryParams = url.format({ query: { sort: JSON.stringify({ name: 'desc' }) } });
        const { body } = await request(app).get(`/v1/notebooks${queryParams}`);

        expect(
          body.map(({ name }) => name),
        ).to.eql(['c', 'b', 'a']);
      });

      context('when sort param is not an object', () => {
        let response;

        beforeEach(async () => {
          response = await request(app).get('/v1/notebooks?sort=notanobject');
        });

        it('returns BAD_REQUEST status', () => {
          const { statusCode } = response;
          expect(statusCode).to.equal(BAD_REQUEST);
        });

        it('provides and error message', () => {
          const { message } = response.body;
          expect(message).to.equal('Sort param must be an object');
        });
      });
    });
  });

  describe('GET /notebooks/:id', () => {
    let app;
    let notebook;

    context('when the notebook exists', () => {
      beforeEach(async () => {
        app = stubNotebooksMiddleware();
        notebook = await notebookFactory.create('notebook');
      });

      it('returns a presented notebook with contentBlocks', async () => {
        const { body } = await request(app).get(`/v1/notebooks/${notebook.id}`);
        const presented = await NotebookPresenter
          .init({ notebook })
          .present({ includeContentBlocks: true });

        expect(body).to.eql(presented);
        expect(body).to.have.own.property('contentBlocks');
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
