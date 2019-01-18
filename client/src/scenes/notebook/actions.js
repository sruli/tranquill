export const NOTEBOOK_RETRIEVED = 'notebook.NOTEBOOK_RETRIEVED';
export const EDITOR_CHANGED = 'notebook.EDITOR_CHANGED';

export const notebookRetrieved = notebook => ({
  type: NOTEBOOK_RETRIEVED,
  payload: { notebook },
});

export const editorChanged = editorState => ({
  type: EDITOR_CHANGED,
  payload: { editorState },
});
