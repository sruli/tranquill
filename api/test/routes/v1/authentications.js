const request = require('supertest');
const { expect } = require('chai');
const { NO_CONTENT, BAD_REQUEST } = require('http-status');
const app = require('../../../src/app');
const userFactory = require('../../factories/userFactory');
const parseCookie = require('../../helpers/parseCookie');
const expectJWT = require('../../helpers/expectJWT');

describe('authentications routes', () => {
  describe('POST /authentications', () => {
    context('when email param is missing', () => {
      let response;

      beforeEach(async () => {
        const body = { password: 'greatpassword' };
        response = await request(app).post('/v1/authentications').send(body);
      });

      it('sets BAD_REQUEST status', () => {
        const { statusCode } = response;
        expect(statusCode).to.equal(BAD_REQUEST);
      });

      it('sets proper message', () => {
        const { message } = response.body;
        expect(message).to.equal('Email and password are required.');
      });
    });

    context('when password param is missing', () => {
      let response;

      beforeEach(async () => {
        const body = { email: 'email@example.com' };
        response = await request(app).post('/v1/authentications').send(body);
      });

      it('sets BAD_REQUEST status', () => {
        const { statusCode } = response;
        expect(statusCode).to.equal(BAD_REQUEST);
      });

      it('sets proper message', () => {
        const { message } = response.body;
        expect(message).to.equal('Email and password are required.');
      });
    });

    context('when email and password params are missing', () => {
      let response;

      beforeEach(async () => {
        response = await request(app).post('/v1/authentications').send({});
      });

      it('sets BAD_REQUEST status', () => {
        const { statusCode } = response;
        expect(statusCode).to.equal(BAD_REQUEST);
      });

      it('sets proper message', () => {
        const { message } = response.body;
        expect(message).to.equal('Email and password are required.');
      });
    });

    context('when user is not found', () => {
      it('sets NOT_FOUND status', () => {
      });
    });

    context('when user is found', () => {
      let response;

      beforeEach(async () => {
        const user = await userFactory.create('user', { password: 'awesomepassword' });
        const { email } = user;
        const password = 'awesomepassword';
        response = await request(app).post('/v1/authentications').send({ email, password });
      });

      it('sets NO_CONTENT status', () => {
        const { statusCode } = response;
        expect(statusCode).to.equal(NO_CONTENT);
      });

      it('sets jwt cookie', () => {
        const cookies = response.header['set-cookie'];
        const jwtCookie = cookies.find(cookie => cookie.match(/authJWT/));
        const jwt = parseCookie(jwtCookie).authJWT;
        expectJWT(jwt);
      });

      it('sets jwt cookie as HttpOnly', () => {
        const cookies = response.header['set-cookie'];
        const jwtCookie = cookies.find(cookie => cookie.match(/authJWT/));
        expect(parseCookie(jwtCookie).HttpOnly).to.be.true;
      });

      it('sets jwt cookie as Secure', () => {
        const cookies = response.header['set-cookie'];
        const jwtCookie = cookies.find(cookie => cookie.match(/authJWT/));
        expect(parseCookie(jwtCookie).Secure).to.be.true;
      });
    });
  });
});
