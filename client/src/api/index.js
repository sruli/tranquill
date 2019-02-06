const getNotebook = async (id) => {
  const response = await fetch(`/v1/notebooks/${id}`).then(res => res.json());
  return response;
};

const saveEditorState = async ({ notebookId, rawEditorState }) => {
  await fetch(`/v1/notebooks/${notebookId}/contentBlocks`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(rawEditorState),
  });
};

const signInUser = () => {};

export default {
  getNotebook,
  saveEditorState,
  signInUser,
};
