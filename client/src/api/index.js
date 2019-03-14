import url from 'url';

const apiURL = process.env.REACT_APP_API_URL;

const getNotebooks = async function getNotebooks() {
  const queryString = url.format({ query: { sort: JSON.stringify({ updatedAt: 'desc' }) } });
  const response = await fetch(`${apiURL}/v1/notebooks?${queryString}`, {
    credentials: 'include',
  }).then(res => res.json());
  return response;
};

const getNotebook = async function getNotebook(id) {
  const response = await fetch(`${apiURL}/v1/notebooks/${id}`, { credentials: 'include' });
  if (response.ok) return response.json();
  return response;
};

const saveEditorState = async function saveEditorState({ notebookId, rawEditorState }) {
  const response = await fetch(`${apiURL}/v1/notebooks/${notebookId}/contentBlocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(rawEditorState),
  });

  return response;
};

const signInUser = async function signInUser({ email, password }) {
  const response = await fetch(`${apiURL}/v1/authentications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  return response;
};

const signOutUser = async function signOutUser() {
  await fetch(`${apiURL}/v1/authentications`, {
    method: 'DELETE',
    credentials: 'include',
  });
};

const submitEmailSignup = async function submitEmailSignup({ email }) {
  const response = await fetch(`${apiURL}/v1/emailSignups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });

  try {
    return await response.json();
  } catch (e) {
    return response;
  }
};

export default {
  getNotebooks,
  getNotebook,
  saveEditorState,
  signInUser,
  signOutUser,
  submitEmailSignup,
};
