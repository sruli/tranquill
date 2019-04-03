import { genKey } from 'draft-js';

const get = (overrides = {}) => {
  const offset = overrides.offset || 0;
  const limit = overrides.limit || 10;

  const response = {
    offset,
    href: `http://localhost:8080/notebooks/5c374963bb3224058cf7d2aa/contentBlocks?offset=${offset}&limit=${limit}`,
    items: [
      {
        createdAt: '2019-01-22T06:47:22.013Z',
        data: {},
        depth: 0,
        entityRanges: [],
        inlineStyleRanges: [],
        key: genKey(),
        notebook: '5c374963bb3224058cf7d2aa',
        text: 'Some text',
        type: 'unstyled',
        updatedAt: '2019-01-22T06:47:37.962Z',
        position: offset,
      },
    ],
    previous: null,
  };

  return {
    ...response,
    ...overrides,
  };
};

export default {
  get,
};
