const getNotebookResponse = (overrides = {}) => {
  const response = {
    createdAt: '2019-01-10T13:32:19.770Z',
    href: 'http://localhost:8080/notebooks/5c374963bb3224058cf7d2aa',
    id: '5c374963bb3224058cf7d2aa',
    name: 'First notebook',
    updatedAt: '2019-01-17T03:46:43.841Z',
    contentBlocks: {
      href: 'http://localhost:8080/notebooks/5c374963bb3224058cf7d2aa/contentBlocks',
      items: [
        {
          createdAt: '2019-01-22T06:47:22.013Z',
          data: {},
          depth: 0,
          entityRanges: [],
          inlineStyleRanges: [],
          key: 'aergj',
          notebook: '5c374963bb3224058cf7d2aa',
          position: 0,
          text: 'Some text',
          type: 'unstyled',
          updatedAt: '2019-01-22T06:47:37.962Z',
        },
      ],
    },
  };

  return {
    ...response,
    ...overrides,
  };
};

export default getNotebookResponse;
