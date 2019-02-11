import { takeLatest, debounce, select, put, call } from 'redux-saga/effects';
import api from '../../api';
import validateForm from './validateForm';
import { getEmail, getPassword, getValidate } from './reducer';
import { DEBOUNCE_MILISECONDS } from './constants';
import {
  formValidated,
  authenticationCompleted,
  authenticationStarted,
  FORM_SUBMITTED,
  FORM_CHANGED,
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

function* signInSaga() {
  yield debounce(DEBOUNCE_MILISECONDS, FORM_CHANGED, onFormChanged);
  yield takeLatest(FORM_SUBMITTED, submitForm);
}

export default signInSaga;
