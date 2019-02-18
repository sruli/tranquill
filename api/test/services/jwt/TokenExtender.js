const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const TokenGenerator = require('../../../src/services/jwt/TokenGenerator');
const TokenExtender = require('../../../src/services/jwt/TokenExtender');

describe('TokenExtender', () => {
  describe('prototype.extendToken()', () => {
    it('extends a jwt', async () => {
      const token = await TokenGenerator.init({ userId: 'userId' }).generateToken();
      const decodedJWT = jwt.decode(token);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const extended = await TokenExtender.init({ decodedJWT }).extendToken();
      const decodedExtendedJWT = jwt.decode(extended);

      expect(decodedExtendedJWT.exp - decodedJWT.exp).to.equal(1);
    });
  });
});
