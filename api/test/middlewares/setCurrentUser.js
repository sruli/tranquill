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
      res = createResponse();
    });

    it('sets the currentUser', async () => {
      req.userId = user.id;
      await setCurrentUser(req, res, () => {});
      expect(res.locals.currentUser.toJSON()).to.eql(user.toJSON());
    });
  });

  context('when user is not found', () => {
    let req;
    let res;

    beforeEach(() => {
      req = createRequest();
      res = createResponse();
    });

    it('returns NOT_FOUND status', async () => {
      req.userId = mongoose.Types.ObjectId();
      await setCurrentUser(req, res, () => {});
      expect(res.statusCode).to.equal(NOT_FOUND);
    });
  });
});
