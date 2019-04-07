const has = require('lodash/has');

/**
 * From draft-js:
 * https://github.com/facebook/draft-js/blob/master/src/model/keys/generateRandomKey.js
 */
const multiplier = 2 ** 24;

class ContentBlockKeyGenerator {
  static init() {
    const contentBlockKeyGenerator = new ContentBlockKeyGenerator();
    return contentBlockKeyGenerator;
  }

  constructor() {
    this.seenKeys = {};
  }

  generateRandomKey() {
    let key;
    while (key === undefined || has(this.seenKeys, key) || !Number.isNaN(+key)) {
      key = Math.floor(Math.random() * multiplier).toString(32);
    }
    this.seenKeys[key] = true;
    return key;
  }
}

module.exports = ContentBlockKeyGenerator;
