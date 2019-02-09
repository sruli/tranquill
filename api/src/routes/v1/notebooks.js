const { Router } = require('express');
const { OK, NOT_FOUND } = require('http-status');
const Notebook = require('../../models/Notebook');
const { present } = require('../../services/presenters/notebookPresenter');
const ensureAuthentication = require('../../middlewares/ensureAuthentication');

const router = Router();

router.get('/notebooks/:id', ensureAuthentication, async (req, res) => {
  const { id } = req.params;
  const notebook = await Notebook.findById(id);

  if (notebook) {
    const presentedNotebook = await present(notebook);
    return res.status(OK).json(presentedNotebook);
  }

  return res.status(NOT_FOUND).end();
});

module.exports = router;
