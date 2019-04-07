const ContentBlock = require('../../models/ContentBlock');

const { API_URL } = process.env;

const getCurrentHref = function getCurrentHref(notebook, firstPosition, limit) {
  return `${API_URL}/v1/notebooks/${notebook.id}/contentBlocks?offset=${firstPosition}&limit=${limit}`;
};

const getPreviousHref = function getPreviousHref(notebook, firstPosition, currentLimit) {
  if (firstPosition <= 0) {
    return null;
  }

  const offset = Math.max(firstPosition - currentLimit, 0);
  const limit = Math.min(firstPosition, currentLimit);

  return `${API_URL}/v1/notebooks/${notebook.id}/contentBlocks?offset=${offset}&limit=${limit}`;
};

const getNextHref = function getNextHref(notebook, lastPosition, total, limit) {
  const nextPosition = lastPosition + 1;

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
    const firstPosition = this.contentBlocks[0] ? this.contentBlocks[0].position : 0;
    const lastPosition = this.contentBlocks[this.contentBlocks.length - 1] ? (
      this.contentBlocks[this.contentBlocks.length - 1].position
    ) : total;

    return {
      total,
      href: getCurrentHref(this.notebook, firstPosition, this.limit),
      items: this.contentBlocks.map(contentBlock => contentBlock.toJSON()),
      limit: this.limit,
      offset: firstPosition,
      previous: getPreviousHref(this.notebook, firstPosition, this.limit),
      next: getNextHref(this.notebook, lastPosition, total, this.limit),
    };
  }
}

module.exports = ContentBlocksPresenter;
