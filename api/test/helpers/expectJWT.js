const { expect } = require('chai');

const expectJWT = function expectJWT(token) {
  expect(token.split('.')).to.have.lengthOf(3);
};

module.exports = expectJWT;
