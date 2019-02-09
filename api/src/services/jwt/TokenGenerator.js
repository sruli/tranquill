const jwt = require('jsonwebtoken');

const defaultOptions = {
  expiresIn: '15m',
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
    const options = { ...defaultOptions, subject: this.userId };
    const token = await jwt.sign({}, process.env.JWT_SECRET, options);
    return token;
  }
}

module.exports = TokenGenerator;
