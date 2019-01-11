const { Router } = require('express');
const { OK, NOT_FOUND } = require('http-status');
const Notebook = require('../../models/notebook');

const router = Router();

router.get('/notebooks/:id', async (req, res) => {
  const { id } = req.params;
  const notebook = await Notebook.findById(id);

  if (notebook) {
    const { name } = notebook;
    return res.status(OK).json({ name });
  }

  return res.status(NOT_FOUND).end();
});

module.exports = router;
