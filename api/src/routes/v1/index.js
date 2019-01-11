const { Router } = require('express');
const notebooks = require('./notebooks');

const router = Router();

router.use(notebooks);

module.exports = router;
