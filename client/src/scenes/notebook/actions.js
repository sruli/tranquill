export const NOTEBOOK_RETRIEVED = 'notebook.NOTEBOOK_RETRIEVED';
export const EDITOR_CHANGED = 'notebook.EDITOR_CHANGED';
export const MORE_CONTENT_RETRIEVED = 'notebook.MORE_CONTENT_RETRIEVED';
export const LOAD_MORE_CONTENT = 'notebook.LOAD_MORE_CONTENT';

export const notebookRetrieved = payload => ({
  payload,
  type: NOTEBOOK_RETRIEVED,
});

export const moreContentRetrieved = payload => ({
  payload,
  type: MORE_CONTENT_RETRIEVED,
});

export const editorChanged = (editorState, offset) => ({
  type: EDITOR_CHANGED,
  payload: { editorState, offset },
});

export const loadMoreContent = loadMoreUrl => ({
  type: LOAD_MORE_CONTENT,
  payload: { loadMoreUrl },
});
