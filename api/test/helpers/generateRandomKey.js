const has = require('has');

/**
 * From draft-js:
 * https://github.com/facebook/draft-js/blob/master/src/model/keys/generateRandomKey.js
 */
const seenKeys = {};
const MULTIPLIER = 2 ** 24;
function generateRandomKey() {
  let key;
  while (key === undefined || has(seenKeys, key) || !Number.isNaN(+key)) {
    key = Math.floor(Math.random() * MULTIPLIER).toString(32);
  }
  seenKeys[key] = true;
  return key;
}

module.exports = generateRandomKey;
