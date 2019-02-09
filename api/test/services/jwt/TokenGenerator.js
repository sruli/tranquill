const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const userFactory = require('../../factories/userFactory');
const TokenGenerator = require('../../../src/services/jwt/TokenGenerator');
const expectJWT = require('../../helpers/expectJWT');

describe('TokenGenerator', () => {
  describe('prototype.generateToken()', () => {
    let user;
    let token;

    beforeEach(async () => {
      user = await userFactory.create('user');
      const { id: userId } = user;
      token = await TokenGenerator.init({ userId }).generateToken();
    });

    it('generates a jwt token', () => {
      expectJWT(token);
    });

    it('sets the issued at time', () => {
      const decoded = jwt.decode(token);
      expect(decoded.iat).to.exist;
    });

    it('sets the expiration for fifteen minutes', () => {
      const { iat, exp } = jwt.decode(token);
      const expiry = exp - iat;
      expect(expiry).to.equal(900); // 900s === 15m
    });

    it('sets the issuer', () => {
      const decoded = jwt.decode(token);
      expect(decoded.iss).to.equal('Tranquill');
    });

    it('sets the subject to user id', () => {
      const decoded = jwt.decode(token);
      expect(decoded.sub).to.equal(user.id);
    });
  });
});
