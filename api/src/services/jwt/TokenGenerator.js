const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const { EXPIRES_IN } = require('./constants');

const defaultOptions = {
  expiresIn: EXPIRES_IN,
  issuer: 'Tranquill',
};

class TokenGenerator {
  static init(args) {
    const tokenGenerator = new TokenGenerator(args);
    return tokenGenerator;
  }

  constructor({ userId }) {
    this.userId = userId;
  }

  async generateToken() {
    const opts = { ...defaultOptions, jwtid: uuidv4(), subject: this.userId };
    const token = await jwt.sign({}, process.env.JWT_SECRET, opts);
    return token;
  }
}

module.exports = TokenGenerator;
