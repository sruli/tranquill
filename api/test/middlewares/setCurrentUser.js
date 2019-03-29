const { expect } = require('chai');
const mongoose = require('mongoose');
const { createRequest, createResponse } = require('node-mocks-http');
const { NOT_FOUND } = require('http-status');
const setCurrentUser = require('../../src/middlewares/setCurrentUser');
const userFactory = require('../factories/userFactory');

describe('setCurrentUser', () => {
  context('when user is found', () => {
    let user;
    let req;
    let res;

    beforeEach(async () => {
      user = await userFactory.create('user');
      req = createRequest();
      res = createResponse({ locals: { userId: user.id } });
    });

    it('sets the currentUser', async () => {
      await setCurrentUser(req, res, () => {});
      expect(res.locals.currentUser.toJSON()).to.eql(user.toJSON());
    });
  });

  context('when user is not found', () => {
    let req;
    let res;

    beforeEach(() => {
      req = createRequest();
      res = createResponse({ locals: { userId: mongoose.Types.ObjectId() } });
    });

    it('returns NOT_FOUND status', async () => {
      await setCurrentUser(req, res, () => {});
      expect(res.statusCode).to.equal(NOT_FOUND);
    });
  });
});
