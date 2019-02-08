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

  const token = await TokenGenerator.init({ user }).generateToken();
  res.cookie('authJwt', token, { httpOnly: true, secure: !devEnv() });

  return res.status(NO_CONTENT).end();
});

module.exports = router;
