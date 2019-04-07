const { Router } = require('express');
const bodyParser = require('body-parser');
const { ACCEPTED, NOT_FOUND, BAD_REQUEST, OK } = require('http-status');
const isNil = require('lodash/isNil');
const isString = require('lodash/isString');
const ContentBlock = require('../../../models/ContentBlock');
const ContentBlocksPresenter = require('../../../services/presenters/ContentBlocksPresenter');
const ContentBlocksPersistenceManager = require('../../../services/contentBlocks/ContentBlocksPersistenceManager');
const ensureAuthentication = require('../../../middlewares/ensureAuthentication');
const setCurrentUser = require('../../../middlewares/setCurrentUser');

const jsonParser = bodyParser.json();
const router = Router();

const setNotebook = async function setNotebook(req, res, next) {
  const { id } = req.params;
  const { currentUser } = res.locals;

  const notebook = await currentUser.notebooksQuery().findOne({ _id: id });

  if (!notebook) {
    return res.status(NOT_FOUND).json({
      message: `Could not find notebook with ID ${id}`,
    });
  }

  res.locals.notebook = notebook;
  return next();
};

const sanitizeQueryParam = function sanitizeQueryParam(param) {
  return (req, res, next) => {
    const val = req.query[param];

    if (isNil(val)) return next();

    if (isString(val) && val.length === 0) {
      req.query[param] = null;
    } else if (Number.isInteger(Number(val))) {
      req.query[param] = Number(val);
    } else {
      req.query[param] = null;
    }

    return next();
  };
};

router.get(
  '/notebooks/:id/contentBlocks',
  ensureAuthentication,
  setCurrentUser,
  setNotebook,
  sanitizeQueryParam('offset'),
  sanitizeQueryParam('limit'),
  async (req, res) => {
    const { notebook } = res.locals;
    const { offset = 0, limit = ContentBlock.FETCH_LIMIT_DEFAULT } = req.query;

    const contentBlocks = await notebook.contentBlocksQuery({
      query: { position: { $gte: offset } },
      options: { limit, sort: { position: 'asc' } },
    });

    const presented = await ContentBlocksPresenter.init({
      notebook,
      contentBlocks,
      limit,
    }).present();

    return res.status(OK).json(presented);
  },
);

router.post(
  '/notebooks/:id/contentBlocks',
  ensureAuthentication,
  setCurrentUser,
  setNotebook,
  sanitizeQueryParam('offset'),
  jsonParser,
  async (req, res) => {
    const { blocks } = req.body;
    const { offset } = req.query;
    const { notebook } = res.locals;

    if (!blocks || !Array.isArray(blocks)) {
      return res.status(BAD_REQUEST).json({
        message: 'Request must contain an array of blocks',
      });
    }

    if (isNil(offset) || !Number.isInteger(offset)) {
      return res.status(BAD_REQUEST).json({
        message: 'Request must contain an offset with an Integer value',
      });
    }

    ContentBlocksPersistenceManager.init({
      notebook,
      blocks,
      options: { offset },
    }).manage();

    await notebook.touch();

    return res.status(ACCEPTED).end();
  },
);

module.exports = router;
