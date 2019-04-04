const ContentBlock = require('../../models/ContentBlock');

const { API_URL } = process.env;

const getCurrentHref = function getCurrentHref(notebook, firstContentBlock, limit) {
  const { position } = firstContentBlock;

  return `${API_URL}/v1/notebooks/${notebook.id}/contentBlocks?offset=${position}&limit=${limit}`;
};

const getPreviousHref = function getPreviousHref(notebook, firstContentBlock, currentLimit) {
  const { position } = firstContentBlock;

  if (position <= 0) {
    return null;
  }

  const offset = Math.max(position - currentLimit, 0);
  const limit = Math.min(position, currentLimit);

  return `${API_URL}/v1/notebooks/${notebook.id}/contentBlocks?offset=${offset}&limit=${limit}`;
};

const getNextHref = function getNextHref(notebook, lastContentBlock, total, limit) {
  const { position } = lastContentBlock;
  const nextPosition = position + 1;

  // use nextPosition since position index starts at 0
  if (nextPosition >= total) {
    return null;
  }

  return `${API_URL}/v1/notebooks/${notebook.id}/contentBlocks?offset=${nextPosition}&limit=${limit}`;
};

class ContentBlocksPresenter {
  static init(args) {
    const contentBlocksPresenter = new ContentBlocksPresenter(args);
    return contentBlocksPresenter;
  }

  constructor({ notebook, contentBlocks, limit }) {
    this.notebook = notebook;
    this.contentBlocks = contentBlocks;
    this.limit = limit || ContentBlock.FETCH_LIMIT_DEFAULT;
  }

  async present() {
    const total = await this.notebook.contentBlocksQuery().countDocuments();
    const first = this.contentBlocks[0] || { position: 0 };
    const last = this.contentBlocks[this.contentBlocks.length - 1] || { position: total };

    return {
      total,
      href: getCurrentHref(this.notebook, first, this.limit),
      items: this.contentBlocks.map(contentBlock => contentBlock.toJSON()),
      limit: this.limit,
      offset: first.position,
      previous: getPreviousHref(this.notebook, first, this.limit),
      next: getNextHref(this.notebook, last, total, this.limit),
    };
  }
}

module.exports = ContentBlocksPresenter;
