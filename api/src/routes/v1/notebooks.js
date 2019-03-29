const { Router } = require('express');
const { OK, NOT_FOUND, BAD_REQUEST } = require('http-status');
const NotebooksPresenter = require('../../services/presenters/NotebooksPresenter');
const NotebookPresenter = require('../../services/presenters/NotebookPresenter');
const ensureAuthentication = require('../../middlewares/ensureAuthentication');
const setCurrentUser = require('../../middlewares/setCurrentUser');

const router = Router();

router.get('/notebooks', ensureAuthentication, setCurrentUser, async (req, res) => {
  const options = {};
  const { sort } = req.query;
  const { currentUser } = res.locals;

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

  const notebooks = await currentUser.notebooksQuery({ options });
  const presentedNotebooks = await NotebooksPresenter.init({ notebooks }).present();
  return res.status(OK).json(presentedNotebooks);
});

router.get('/notebooks/:id', ensureAuthentication, setCurrentUser, async (req, res) => {
  const { id } = req.params;
  const { currentUser } = res.locals;

  const notebook = await currentUser.notebooksQuery().findOne({ _id: id });

  if (!notebook) return res.status(NOT_FOUND).end();

  const presentedNotebook = await NotebookPresenter
    .init({ notebook })
    .present({ includeContentBlocks: true });

  return res.status(OK).json(presentedNotebook);
});

module.exports = router;
