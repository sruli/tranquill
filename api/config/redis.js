const redis = require('redis');
const { promisify } = require('util');

const { REDIS_HOST, REDIS_PORT, REDIS_DB } = process.env;
const client = redis.createClient(`redis://${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`);

module.exports = {
  ...client,
  setAsync: promisify(client.set).bind(client),
  getAsync: promisify(client.get).bind(client),
  setexAsync: promisify(client.setex).bind(client),
  psetexAsync: promisify(client.psetex).bind(client),
  existsAsync: promisify(client.exists).bind(client),
  expireatAsync: promisify(client.expireat).bind(client),
  lsetAsync: promisify(client.set).bind(client),
  hsetAsync: promisify(client.hset).bind(client),
  hgetAsync: promisify(client.hget).bind(client),
  hgetallAsync: promisify(client.hgetall).bind(client),
  hexistsAsync: promisify(client.hexists).bind(client),
  delAsync: promisify(client.del).bind(client),
  flushdbAsync: promisify(client.flushdb).bind(client),
  quitAsync: promisify(client.quit).bind(client),
};
