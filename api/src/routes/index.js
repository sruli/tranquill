const { Router } = require('express');
const { OK } = require('http-status');
const apiV1 = require('./v1');

const router = Router();

// For Kubernetes health check
router.get('/', (req, res) => {
  res.status(OK).end();
});

router.use('/v1', apiV1);

module.exports = router;
