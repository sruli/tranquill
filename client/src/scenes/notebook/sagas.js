import { takeEvery, debounce, select, put } from 'redux-saga/effects';
import { matchPath } from 'react-router-dom';
import { LOCATION_CHANGE, getLocation } from 'connected-react-router';
import { convertToRaw } from 'draft-js';
import api from '../../api';
import transmuter from '../../api/transmuter';
import authenticatedRequest from '../../api/authenticatedRequest';
import { SCENE_PATH, DEBOUNCE_MILISECONDS } from './constants';
import { notebookRetrieved, moreContentRetrieved, EDITOR_CHANGED, LOAD_MORE_CONTENT } from './actions';
import { getNotebookId } from './reducer';

function* loadNotebook() {
  const location = yield select(getLocation);
  const match = matchPath(location.pathname, { path: SCENE_PATH, exact: true });
  if (!match) return;

  const { id } = match.params;

  yield* authenticatedRequest({
    request: api.getNotebook,
    requestArgs: [id],
    callback: function* apiCallback(response) {
      const transmutedResponse = transmuter.getNotebook.fromServer(response);
      yield put(notebookRetrieved(transmutedResponse));
    },
  });
}

function* saveEditorState(action) {
  const { editorState, offset } = action.payload;
  const notebookId = yield select(getNotebookId);
  if (!notebookId) return;

  const rawEditorState = convertToRaw(editorState.getCurrentContent());
  const params = transmuter.saveEditorState.toServer({ notebookId, rawEditorState, offset });
  yield* authenticatedRequest({ request: api.saveEditorState, requestArgs: [params] });
}

function* loadMoreContent(action) {
  const { loadMoreUrl } = action.payload;

  yield* authenticatedRequest({
    request: api.loadMoreContent,
    requestArgs: [loadMoreUrl],
    callback: function* apiCallback(response) {
      const transmutedResponse = transmuter.loadMoreContent.fromServer(response);
      yield put(moreContentRetrieved(transmutedResponse));
    },
  });
}

function* notebookSaga() {
  yield takeEvery(LOCATION_CHANGE, loadNotebook);
  yield takeEvery(LOAD_MORE_CONTENT, loadMoreContent);
  yield debounce(DEBOUNCE_MILISECONDS, EDITOR_CHANGED, saveEditorState);
}

export default notebookSaga;
