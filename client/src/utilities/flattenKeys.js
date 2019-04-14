/**
 * From: https://github.com/yahoo/react-intl/wiki/Upgrade-Guide#flatten-messages-object
 *
 * Takes a nested object like this:
 *
 *   {
 *     outer: {
 *       inner: 'some value',
 *     }
 *   }
 *
 * and outputs it as this:
 *
 *   {
 *     'outer.inner': 'some value',
 *   }
 */

const flattenKeys = function flattenMessages(nestedMessages, prefix = '') {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      return { ...messages, [prefixedKey]: value };
    }

    return { ...messages, ...flattenMessages(value, prefixedKey) };
  }, {});
};

export default flattenKeys;
