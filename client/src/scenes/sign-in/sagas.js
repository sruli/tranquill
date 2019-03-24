import { takeEvery, takeLatest, debounce, select, put, call } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import api from '../../api';
import transmuter from '../../api/transmuter';
import validateForm from './validateForm';
import { setCookie } from '../../utilities/cookieUtils';
import { getEmail, getPassword, getValidate } from './reducer';
import { DEBOUNCE_MILISECONDS } from './constants';
import {
  formValidated,
  authenticationCompleted,
  authenticationStarted,
  FORM_SUBMITTED,
  FORM_CHANGED,
  AUTHENTICATION_COMPLETED,
} from './actions';

function* onFormChanged() {
  const validate = yield select(getValidate);
  if (!validate) return;

  const email = yield select(getEmail);
  const password = yield select(getPassword);
  const { errors } = yield call(validateForm, { email, password });

  yield put(formValidated(errors));
}

function* submitForm() {
  const email = yield select(getEmail);
  const password = yield select(getPassword);
  const { errors } = yield call(validateForm, { email, password });

  yield put(formValidated(errors));

  if (errors.length > 0) return;

  yield put(authenticationStarted());
  const { ok, status } = yield call(api.signInUser, { email, password });

  yield put(authenticationCompleted({ ok, status }));
}

function* onAuthenticationCompleted(action) {
  const { error } = action;
  if (error) return;

  setCookie({ authenticated: true });

  const response = yield call(api.getNotebooks);
  const { notebookPath } = transmuter.getNotebooks.fromServer(response);
  if (notebookPath) {
    yield put(push(notebookPath));
  } else {
    // Figure out what do do when there are no notebooks
  }
}

function* signInSaga() {
  yield debounce(DEBOUNCE_MILISECONDS, FORM_CHANGED, onFormChanged);
  yield takeLatest(FORM_SUBMITTED, submitForm);
  yield takeEvery(AUTHENTICATION_COMPLETED, onAuthenticationCompleted);
}

export default signInSaga;
