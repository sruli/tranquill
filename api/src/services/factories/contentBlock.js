const ContentBlock = require('../../models/contentBlock');

const createOrUpdate = async function createOrUpdate(notebook, block) {
  const { key } = block;
  // This is actually probably problematic. I don't know that keys are globaly
  // unique. I need to make sure that this query is scroped to the notebook.
  let contentBlock = await ContentBlock.findOne({ key });

  if (contentBlock) {
    contentBlock.set(block);
  } else {
    contentBlock = new ContentBlock({ ...block, notebook });
  }
  await contentBlock.save();
};

module.exports = { createOrUpdate };
