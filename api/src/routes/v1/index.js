const { Router } = require('express');
const authentications = require('./authentications');
const emailSignups = require('./emailSignups');
const notebooks = require('./notebooks');
const notebooksContentBlocks = require('./notebooks/contentBlocks');

const router = Router();

router.use(authentications);
router.use(emailSignups);
router.use(notebooks);
router.use(notebooksContentBlocks);

module.exports = router;
