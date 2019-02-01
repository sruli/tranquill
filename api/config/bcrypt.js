const SALT_ROUNDS = process.env.NODE_ENV === 'test' ? 1 : 10;

module.exports = { SALT_ROUNDS };
