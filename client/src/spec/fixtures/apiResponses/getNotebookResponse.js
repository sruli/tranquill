import contentBlocks from './contentBlocks';

const getNotebookResponse = (overrides = {}) => {
  const response = {
    createdAt: '2019-01-10T13:32:19.770Z',
    href: 'http://localhost:8080/notebooks/5c374963bb3224058cf7d2aa',
    id: '5c374963bb3224058cf7d2aa',
    name: 'First notebook',
    updatedAt: '2019-01-17T03:46:43.841Z',
    contentBlocks: contentBlocks.get(),
  };

  return {
    ...response,
    ...overrides,
  };
};

export default getNotebookResponse;
