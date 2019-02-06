import { takeEvery, debounce, select, put, call } from 'redux-saga/effects';
import api from '../../api';
import validateForm from './validateForm';
import { formValidated, FORM_SUBMITTED, FORM_CHANGED } from './actions';
import { getEmail, getPassword, getValidate } from './reducer';
import { DEBOUNCE_MILISECONDS } from './constants';

function* onFormChanged() {
  const validate = yield select(getValidate);
  if (!validate) return;

  const email = yield select(getEmail);
  const password = yield select(getPassword);
  const { errors } = yield call(validateForm, { email, password });
  yield put(formValidated(errors));
}

function* onFormSubmitted() {
  const email = yield select(getEmail);
  const password = yield select(getPassword);
  const { valid, errors } = yield call(validateForm, { email, password });
  yield put(formValidated(errors));
  if (!valid) return;
  yield call(api.signInUser, { email, password });
}

function* signInSaga() {
  yield debounce(DEBOUNCE_MILISECONDS, FORM_CHANGED, onFormChanged);
  yield takeEvery(FORM_SUBMITTED, onFormSubmitted);
}

export default signInSaga;
