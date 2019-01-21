const mongoose = require('mongoose');
const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const { ACCEPTED, NOT_FOUND, UNPROCESSABLE_ENTITY } = require('http-status');
const app = require('../../../../src/app');
const ContentBlockFactory = require('../../../../src/services/factories/ContentBlockFactory');
const notebookFactory = require('../../../factories/notebook');

describe('contentBlocks routes', () => {
  context('happy path', () => {
    let notebook;
    let createOrUpdateSpy;
    let response;

    beforeEach(async () => {
      createOrUpdateSpy = sinon.stub(ContentBlockFactory.prototype, 'createOrUpdate');
      notebook = await notebookFactory.create('notebook');
      response = await request(app)
        .post(`/v1/notebooks/${notebook.id}/contentBlocks`)
        .send({ blocks: [{}, {}, {}] })
        .accept('Accept', 'application/json');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('calls createOrUpdate for each of the blocks', async () => {
      expect(createOrUpdateSpy).to.have.been.calledThrice;

      const { args } = createOrUpdateSpy.getCall(0);
      expect(args[0]).to.deep.equal({});
    });

    it('returns ACCEPTED response', () => {
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

    it('returns UNPROCESSABLE_ENTITY', () => {
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

    it('returns UNPROCESSABLE_ENTITY', () => {
      const { statusCode } = response;
      expect(statusCode).to.equal(UNPROCESSABLE_ENTITY);
    });

    it('provides an error message', () => {
      const { message } = response.body;
      expect(message).to.equal('Request must contain an array of blocks');
    });
  });
});
