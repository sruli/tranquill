const jwt = require('jsonwebtoken');
const redisClient = require('../../../config/redis');

class TokenBlacklist {
  static async add(authJWT) {
    try {
      const { jti, exp } = jwt.decode(authJWT);

      await redisClient.setAsync(jti, true);
      await redisClient.expireatAsync(jti, exp);
    } catch (e) {
      // log something about the error
    }
  }

  static async includes(decodedJWT) {
    const { jti } = decodedJWT;
    const result = await redisClient.existsAsync(jti);
    return result === 1;
  }
}

module.exports = TokenBlacklist;
