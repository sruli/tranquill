const mongoose = require('mongoose');
const { expect } = require('chai');
const sinon = require('sinon');
const { UNAUTHORIZED, BAD_REQUEST } = require('http-status');
const { createRequest, createResponse } = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const ensureAuthentication = require('../../src/middlewares/ensureAuthentication');
const TokenGenerator = require('../../src/services/jwt/TokenGenerator');
const expectJWT = require('../helpers/expectJWT');

describe('ensureAuthentication', () => {
  describe('when there is no authJWT cookie', () => {
    let req;
    let res;

    beforeEach(() => {
      req = createRequest();
      res = createResponse();
    });

    it('returns UNAUTHORIZED status', async () => {
      await ensureAuthentication(req, res, () => {});
      expect(res.statusCode).to.equal(UNAUTHORIZED);
    });
  });

  describe('with an expired jwt', () => {
    let req;
    let res;
    let clearCookie;

    beforeEach(async () => {
      const authJWT = await jwt.sign(
        { exp: Math.floor(Date.now() / 1000) - 1 },
        process.env.JWT_SECRET,
      );
      req = createRequest({ cookies: { authJWT } });
      res = createResponse();
      clearCookie = sinon.spy();
      res.clearCookie = clearCookie;
    });

    afterEach(() => {
      sinon.restore();
    });

    it('clears the jwt cookie', async () => {
      await ensureAuthentication(req, res, () => {});
      expect(clearCookie).to.have.been.called;
    });

    it('returns UNAUTHORIZED status', async () => {
      await ensureAuthentication(req, res, () => {});
      expect(res.statusCode).to.equal(UNAUTHORIZED);
    });
  });

  describe('with an invalid jwt', () => {
    let req;
    let res;
    let clearCookie;

    beforeEach(async () => {
      const authJWT = await jwt.sign({}, 'fake haha', { expiresIn: '1m' });
      req = createRequest({ cookies: { authJWT } });
      res = createResponse();
      clearCookie = sinon.spy();
      res.clearCookie = clearCookie;
    });

    afterEach(() => {
      sinon.restore();
    });

    it('clears the jwt cookie', async () => {
      await ensureAuthentication(req, res, () => {});
      expect(clearCookie).to.have.been.called;
    });

    it('returns BAD_REQUEST status', async () => {
      await ensureAuthentication(req, res, () => {});
      expect(res.statusCode).to.equal(BAD_REQUEST);
    });
  });

  describe('with a valid jwt', () => {
    let userId;
    let req;
    let res;
    let next;

    beforeEach(async () => {
      userId = String(mongoose.Types.ObjectId());
      const authJWT = await TokenGenerator.init({ userId }).generateToken();
      req = createRequest({ cookies: { authJWT } });
      res = createResponse();
      next = sinon.spy();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('sets a userId on the response object', async () => {
      await ensureAuthentication(req, res, next);
      expect(res.locals.userId).to.equal(userId);
    });

    it('sets a new authJWT cookie', async () => {
      await ensureAuthentication(req, res, next);
      const { value: authJWT } = res.cookies.authJWT;
      expectJWT(authJWT);
    });

    it('calls the next middleware', async () => {
      await ensureAuthentication(req, res, next);
      expect(next).to.have.been.called;
    });
  });
});
