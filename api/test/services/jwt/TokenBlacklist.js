const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const redisClient = require('../../../config/redis');
const TokenBlacklist = require('../../../src/services/jwt/TokenBlacklist');

describe('TokenBlacklist', () => {
  describe('add()', () => {
    let authJWT;

    beforeEach(async () => {
      authJWT = await jwt.sign(
        {},
        process.env.JWT_SECRET,
        { jwtid: 'jwtid', subject: 'sub', expiresIn: '1s' },
      );
    });

    it('adds a jwtid to the blacklist', async () => {
      await TokenBlacklist.add(authJWT);
      const { jti } = jwt.decode(authJWT);
      expect(await redisClient.existsAsync(jti)).to.equal(1);
    });

    it('expires the cache when the token expires', async () => {
      await TokenBlacklist.add(authJWT);
      await new Promise(resolve => setTimeout(resolve, 1100));
      const { jti } = jwt.decode(authJWT);
      expect(await redisClient.existsAsync(jti)).to.equal(0);
    });
  });

  describe('.includes()', () => {
    it('checks if a jwt is blacklisted', async () => {
      const authJWT = await jwt.sign({}, process.env.JWT_SECRET, { jwtid: 'jwtid' });
      const decodedJWT = jwt.decode(authJWT);
      await redisClient.setAsync(decodedJWT.jti, true);
      expect(await TokenBlacklist.includes(decodedJWT)).to.be.true;
    });
  });
});
