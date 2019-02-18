const jwt = require('jsonwebtoken');
const { UNAUTHORIZED, BAD_REQUEST } = require('http-status');
const TokenExtender = require('../services/jwt/TokenExtender');
const TokenBlacklist = require('../services/jwt/TokenBlacklist');
const { devEnv } = require('../utilities/envUtils');

const { TokenExpiredError } = jwt;

const ensureAuthentication = async function ensureAuthentication(req, res, next) {
  const { authJWT } = req.cookies;
  if (!authJWT) return res.status(UNAUTHORIZED).end();

  try {
    const decodedJWT = await jwt.verify(authJWT, process.env.JWT_SECRET);

    if (await TokenBlacklist.includes(decodedJWT)) {
      return res.status(UNAUTHORIZED).json({ message: 'Token no longer valid' });
    }

    req.userId = decodedJWT.sub;

    const extendedToken = await TokenExtender.init({ decodedJWT }).extendToken();
    res.cookie('authJWT', extendedToken, { httpOnly: true, secure: !devEnv() });

    return next();
  } catch (e) {
    const { message } = e;

    res.clearCookie('authJWT');

    if (e instanceof TokenExpiredError) {
      return res.status(UNAUTHORIZED).json({ message });
    }
    return res.status(BAD_REQUEST).json({ message });
  }
};

module.exports = ensureAuthentication;
