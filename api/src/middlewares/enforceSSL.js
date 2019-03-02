const { FORBIDDEN } = require('http-status');
const { devEnv, testEnv } = require('../utilities/envUtils');

const enforceSSL = function SSLRedirect(req, res, next) {
  if (devEnv() || testEnv()) {
    return next();
  }

  if (req.protocol === 'http') {
    return res.status(FORBIDDEN).json({ message: 'HTTPS Required' });
  }

  return next();
};

module.exports = enforceSSL;
