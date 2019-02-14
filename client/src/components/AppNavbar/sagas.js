import { takeLatest, call } from 'redux-saga/effects';
import api from '../../api';
import { SIGN_OUT } from './actions';

function* signOut() {
  yield call(api.signOutUser);
}

function* appNavbarSaga() {
  yield takeLatest(SIGN_OUT, signOut);
}

export default appNavbarSaga;
