const { Router } = require('express');
const bodyParser = require('body-parser');
const { ACCEPTED, NOT_FOUND, BAD_REQUEST } = require('http-status');
const isNil = require('lodash/isNil');
const ContentBlocksPersistenceManager = require('../../../services/contentBlocks/ContentBlocksPersistenceManager');
const Notebook = require('../../../models/Notebook');
const ensureAuthentication = require('../../../middlewares/ensureAuthentication');

const jsonParser = bodyParser.json();
const router = Router();

// TODO: Add GET to align with the href in the contentBlocksPresenter

router.post('/notebooks/:id/contentBlocks', ensureAuthentication, jsonParser, async (req, res) => {
  const { id } = req.params;
  const { blocks } = req.body;
  const { offset } = req.query;

  const notebook = await Notebook.findById(id);

  if (!notebook) {
    return res.status(NOT_FOUND).json({
      message: `Could not find notebook with ID ${id}`,
    });
  }


  if (!blocks || !Array.isArray(blocks)) {
    return res.status(BAD_REQUEST).json({
      message: 'Request must contain an array of blocks',
    });
  }

  if (isNil(offset) || !Number.isInteger(Number(offset))) {
    return res.status(BAD_REQUEST).json({
      message: 'Request must contain a offset with an Integer value',
    });
  }

  ContentBlocksPersistenceManager.init({
    notebook,
    blocks,
    options: { offset: Number(offset) },
  }).manage();

  await notebook.touch();

  return res.status(ACCEPTED).end();
});

module.exports = router;
