const { Router } = require('express');
const bodyParser = require('body-parser');
const { NO_CONTENT, NOT_FOUND, BAD_REQUEST } = require('http-status');
const User = require('../../models/User');
const TokenGenerator = require('../../services/jwt/TokenGenerator');
const { devEnv } = require('../../utilities/envUtils');

const jsonParser = bodyParser.json();
const router = Router();

router.post('/authentications', jsonParser, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).json({ message: 'Email and password are required.' });
  }

  const user = await User.findByEmailAndPassword({ email, password });
  if (!user) return res.status(NOT_FOUND).end();

  const { id: userId } = user;
  const token = await TokenGenerator.init({ userId }).generateToken();
  res.cookie('authJWT', token, { httpOnly: true, secure: !devEnv() });

  return res.status(NO_CONTENT).end();
});

module.exports = router;
