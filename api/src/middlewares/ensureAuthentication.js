const jwt = require('jsonwebtoken');
const { UNAUTHORIZED, BAD_REQUEST } = require('http-status');
const TokenGenerator = require('../services/jwt/TokenGenerator');
const { devEnv } = require('../utilities/envUtils');

const { TokenExpiredError } = jwt;

const ensureAuthentication = async function ensureAuthentication(req, res, next) {
  const { authJWT } = req.cookies;
  if (!authJWT) return res.status(UNAUTHORIZED).end();

  try {
    const { sub: userId } = await jwt.verify(authJWT, process.env.JWT_SECRET);
    req.userId = userId;

    const newToken = await TokenGenerator.init({ userId }).generateToken();
    res.cookie('authJWT', newToken, { httpOnly: true, secure: !devEnv() });

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
