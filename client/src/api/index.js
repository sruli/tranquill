const url = require('url');

const getNotebooks = async function getNotebooks() {
  const queryString = url.format({ query: { sort: JSON.stringify({ updatedAt: 'desc' }) } });
  const response = await fetch(`/v1/notebooks?${queryString}`).then(res => res.json());
  return response;
};

const getNotebook = async function getNotebook(id) {
  const response = await fetch(`/v1/notebooks/${id}`);
  if (response.ok) return response.json();
  return response;
};

const saveEditorState = async function saveEditorState({ notebookId, rawEditorState }) {
  const response = await fetch(`/v1/notebooks/${notebookId}/contentBlocks`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(rawEditorState),
  });

  return response;
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

const signOutUser = async function signOutUser() {
  await fetch('/v1/authentications', { method: 'delete' });
};

export default {
  getNotebooks,
  getNotebook,
  saveEditorState,
  signInUser,
  signOutUser,
};
