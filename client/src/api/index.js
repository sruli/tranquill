const url = require('url');

const getNotebooks = async function getNotebooks() {
  const queryString = url.format({ query: { sort: JSON.stringify({ updatedAt: 'desc' }) } });
  const response = await fetch(`/v1/notebooks?${queryString}`).then(res => res.json());
  return response;
};

const getNotebook = async function getNotebook(id) {
  const response = await fetch(`/v1/notebooks/${id}`).then(res => res.json());
  return response;
};

const saveEditorState = async function saveEditorState({ notebookId, rawEditorState }) {
  await fetch(`/v1/notebooks/${notebookId}/contentBlocks`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(rawEditorState),
  });
};

const signInUser = async function signInUser({ email, password }) {
  const response = await fetch('/v1/authentications', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return response;
};

export default {
  getNotebooks,
  getNotebook,
  saveEditorState,
  signInUser,
};
