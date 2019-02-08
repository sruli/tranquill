const { Router } = require('express');
const bodyParser = require('body-parser');
const { ACCEPTED, NOT_FOUND, UNPROCESSABLE_ENTITY } = require('http-status');
const ContentBlocksPersistenceManager = require('../../../services/ContentBlocksPersistenceManager');
const Notebook = require('../../../models/Notebook');

const jsonParser = bodyParser.json();
const router = Router();

// TODO: Add GET to align with the href in the contentBlocksPresenter

router.post('/notebooks/:id/contentBlocks', jsonParser, async (req, res) => {
  const { id } = req.params;
  const notebook = await Notebook.findById(id);
  if (!notebook) {
    return res.status(NOT_FOUND).json({
      message: `Could not find notebook with ID ${id}`,
    });
  }

  const { blocks } = req.body;

  if (!blocks || !Array.isArray(blocks)) {
    return res.status(UNPROCESSABLE_ENTITY).json({
      message: 'Request must contain an array of blocks',
    });
  }

  ContentBlocksPersistenceManager.init({ notebook, blocks }).manage();

  return res.status(ACCEPTED).end();
});

module.exports = router;
