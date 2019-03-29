export const NOTEBOOK_RETRIEVED = 'notebook.NOTEBOOK_RETRIEVED';
export const EDITOR_CHANGED = 'notebook.EDITOR_CHANGED';

export const notebookRetrieved = ({ notebook, editorState, offset }) => ({
  type: NOTEBOOK_RETRIEVED,
  payload: { notebook, editorState, offset },
});

export const editorChanged = (editorState, offset) => ({
  type: EDITOR_CHANGED,
  payload: { editorState, offset },
});
