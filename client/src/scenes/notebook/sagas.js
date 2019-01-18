import { takeEvery, throttle, select, call, put } from 'redux-saga/effects';
import { matchPath } from 'react-router-dom';
import { LOCATION_CHANGE, getLocation } from 'connected-react-router';
import { convertToRaw } from 'draft-js';
import { THROTTLE_DELAY } from '../../constants';
import api from '../../api';
import { SCENE_PATH } from './constants';
import { notebookRetrieved, EDITOR_CHANGED } from './actions';
import { getNotebookId } from './reducer';

function* loadNotebook() {
  const location = yield select(getLocation);
  const match = matchPath(location.pathname, { path: SCENE_PATH, exact: true });
  if (!match) return;

  const { id } = match.params;
  const notebook = yield call(api.getNotebook, id);
  yield put(notebookRetrieved(notebook));
}

function* saveEditorState(action) {
  const { editorState } = action.payload;
  const notebookId = yield select(getNotebookId);
  if (!notebookId) return;

  const rawEditorState = convertToRaw(editorState.getCurrentContent());
  yield call(api.saveEditorState, { notebookId, rawEditorState });
}

function* notebookSaga() {
  yield takeEvery(LOCATION_CHANGE, loadNotebook);
  // TODO: Replace throttle with debounce when debounce becomes available
  yield throttle(THROTTLE_DELAY, EDITOR_CHANGED, saveEditorState);
}

export default notebookSaga;
