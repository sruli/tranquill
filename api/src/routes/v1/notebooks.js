const { Router } = require('express');
const { OK, NOT_FOUND } = require('http-status');
const Notebook = require('../../models/Notebook');
const NotebookPresenter = require('../../services/presenters/NotebookPresenter');
const ensureAuthentication = require('../../middlewares/ensureAuthentication');

const router = Router();

router.get('/notebooks/:id', ensureAuthentication, async (req, res) => {
  const { id } = req.params;
  const notebook = await Notebook.findById(id);

  if (notebook) {
    const presentedNotebook = await NotebookPresenter.init({ notebook }).present();
    return res.status(OK).json(presentedNotebook);
  }
  if (!notebook) return res.status(NOT_FOUND).end();

  const presentedNotebook = await NotebookPresenter
    .init({ notebook })
    .present({ includeContentBlocks: true });

  return res.status(OK).json(presentedNotebook);
});

module.exports = router;
