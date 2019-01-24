const { API_URL } = process.env;

const present = async function present(notebook) {
  const contentBlocks = await notebook.contentBlocks();

  return {
    href: `${API_URL}/notebooks/${notebook.id}/contentBlocks`,
    items: contentBlocks.map(contentBlock => contentBlock.toJSON()),
  };
};

module.exports = { present };
