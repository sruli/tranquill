const jwt = require('jsonwebtoken');
const { EXPIRES_IN } = require('./constants');

class TokenExtender {
  static init(args) {
    const tokenExtender = new TokenExtender(args);
    return tokenExtender;
  }

  constructor({ decodedJWT }) {
    this.decodedJWT = decodedJWT;
  }

  async extendToken() {
    const { exp, iat, ...payload } = this.decodedJWT;
    const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: EXPIRES_IN });
    return token;
  }
}

module.exports = TokenExtender;
