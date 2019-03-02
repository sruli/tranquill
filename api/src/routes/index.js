const { Router } = require('express');
const apiV1 = require('./v1');

const router = Router();

router.use('/v1', apiV1);

module.exports = router;
