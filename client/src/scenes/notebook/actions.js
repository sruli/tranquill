export const NOTEBOOK_RETRIEVED = 'notebook.NOTEBOOK_RETRIEVED';

export const notebookRetrieved = notebook => ({
  type: NOTEBOOK_RETRIEVED,
  payload: { notebook },
});
