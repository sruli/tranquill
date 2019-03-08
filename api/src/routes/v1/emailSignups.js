const { Router } = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('../../../lib/mailchimp');

const jsonParser = bodyParser.json();
const router = Router();

router.post('/emailSignups', jsonParser, async (req, res) => {
  const { email } = req.body;
  const { status, json } = await mailchimp.subscribe({ email });
  res.status(status).json(json);
});

module.exports = router;
