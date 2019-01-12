import { takeEvery, select, call, put } from 'redux-saga/effects';
import { matchPath } from 'react-router-dom';
import { LOCATION_CHANGE, getLocation } from 'connected-react-router';
import api from '../../api';
import { SCENE_PATH } from './constants';
import { notebookRetrieved } from './actions';

function* loadNotebook() {
  const location = yield select(getLocation);
  const match = matchPath(location.pathname, { path: SCENE_PATH, exact: true });
  if (!match) return;

  const { id } = match.params;
  const notebook = yield call(api.getNotebook, id);
  yield put(notebookRetrieved(notebook));
}

function* notebookSaga() {
  yield takeEvery(LOCATION_CHANGE, loadNotebook);
}

export default notebookSaga;
