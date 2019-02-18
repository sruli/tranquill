const timesMap = function timesMap(num, func) {
  return [...Array(num).keys()].map(func);
};

module.exports = timesMap;
