const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { OK } = require('http-status');
const app = require('../../../src/app');
const mailchimp = require('../../../lib/mailchimp');

describe('emailSignups routes', () => {
  describe('POST /v1/emailSignups', () => {
    let response;

    beforeEach(async () => {
      sinon.stub(mailchimp, 'subscribe').resolves({ status: OK, json: { email_address: 'email@example.com' } });
      response = await request(app).post('/v1/emailSignups').send({ email: 'email@example.com' });
    });

    afterEach(() => {
      mailchimp.subscribe.restore();
    });

    it('attempts to subscribe an email address', () => {
      expect(mailchimp.subscribe).to.have.been.calledWith({ email: 'email@example.com' });
    });

    it('returns the status of the subscribe response', () => {
      expect(response.statusCode).to.equal(OK);
    });

    it('returns the json of the subscribe response', () => {
      expect(response.body).to.eql({ email_address: 'email@example.com' });
    });
  });
});
