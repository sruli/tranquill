import { takeEvery, debounce, select, call, put } from 'redux-saga/effects';
import { matchPath } from 'react-router-dom';
import { LOCATION_CHANGE, getLocation } from 'connected-react-router';
import { convertToRaw } from 'draft-js';
import { DEBOUNCE_MILISECONDS } from '../../constants';
import api from '../../api';
import transmuter from '../../api/transmuter';
import { SCENE_PATH } from './constants';
import { notebookRetrieved, EDITOR_CHANGED } from './actions';
import { getNotebookId } from './reducer';

function* loadNotebook() {
  const location = yield select(getLocation);
  const match = matchPath(location.pathname, { path: SCENE_PATH, exact: true });
  if (!match) return;

  const { id } = match.params;
  const response = yield call(api.getNotebook, id);
  const transmutedResponse = transmuter.getNotebook.fromServer(response);
  yield put(notebookRetrieved(transmutedResponse));
}

function* saveEditorState(action) {
  const { editorState } = action.payload;
  const notebookId = yield select(getNotebookId);
  if (!notebookId) return;

  const rawEditorState = convertToRaw(editorState.getCurrentContent());
  const params = transmuter.saveEditorState.toServer({ notebookId, rawEditorState });
  yield call(api.saveEditorState, params);
}

function* notebookSaga() {
  yield takeEvery(LOCATION_CHANGE, loadNotebook);
  yield debounce(DEBOUNCE_MILISECONDS, EDITOR_CHANGED, saveEditorState);
}

export default notebookSaga;
