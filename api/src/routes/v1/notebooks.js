const { Router } = require('express');
const { OK, NOT_FOUND, BAD_REQUEST } = require('http-status');
const User = require('../../models/User');
const NotebooksPresenter = require('../../services/presenters/NotebooksPresenter');
const NotebookPresenter = require('../../services/presenters/NotebookPresenter');
const ensureAuthentication = require('../../middlewares/ensureAuthentication');

const router = Router();

router.get('/notebooks', ensureAuthentication, async (req, res) => {
  const user = await User.findById(req.userId);
  const options = {};
  const { sort } = req.query;

  if (sort) {
    try {
      options.sort = { ...JSON.parse(sort) };
    } catch (e) {
      if (e instanceof SyntaxError) {
        return res.status(BAD_REQUEST).json({ message: 'Sort param must be an object' });
      }
      // good place to add some logging
    }
  }

  const notebooks = await user.notebooksQuery({ options });
  const presentedNotebooks = await NotebooksPresenter.init({ notebooks }).present();
  return res.status(OK).json(presentedNotebooks);
});

router.get('/notebooks/:id', ensureAuthentication, async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(req.userId);
  const notebook = await user.notebooksQuery().findOne({ _id: id });

  if (!notebook) return res.status(NOT_FOUND).end();

  const presentedNotebook = await NotebookPresenter
    .init({ notebook })
    .present({ includeContentBlocks: true });

  return res.status(OK).json(presentedNotebook);
});

module.exports = router;
