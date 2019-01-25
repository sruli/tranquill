const { present: presentContentBlocks } = require('./contentBlocksPresenter');

const { API_URL } = process.env;

const present = async function present(notebook) {
  return {
    ...notebook.toJSON(),
    href: `${API_URL}/notebooks/${notebook.id}`,
    contentBlocks: await presentContentBlocks(notebook),
  };
};

module.exports = { present };
