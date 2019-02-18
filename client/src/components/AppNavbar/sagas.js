import { takeLatest, put, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import api from '../../api';
import { SIGN_OUT } from './actions';
import { setCookie } from '../../utils/cookieUtils';
import { SCENE_PATH as signInPath } from '../../scenes/sign-in';

function* signOut() {
  setCookie({ authenticated: false });
  yield put(push(signInPath));
  yield call(api.signOutUser);
}

function* appNavbarSaga() {
  yield takeLatest(SIGN_OUT, signOut);
}

export default appNavbarSaga;
