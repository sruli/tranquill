const { Router } = require('express');
const notebooks = require('./notebooks');
const notebooksContentBlocks = require('./notebooks/contentBlocks');

const router = Router();

router.use(notebooks);
router.use(notebooksContentBlocks);

module.exports = router;
