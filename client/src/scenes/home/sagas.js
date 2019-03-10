import { takeLatest, debounce, select, put, call } from 'redux-saga/effects';
import api from '../../api';
import transmuter from '../../api/transmuter';
import { DEBOUNCE_MILISECONDS } from './constants';
import { getValidate, getEmail } from './reducer';
import validateForm from './validateForm';
import { FORM_SUBMITTED, FORM_CHANGED, formValidated, emailSubmitStarted, emailSubmitCompleted } from './actions';

const onFormChanged = function* onFormChanged(action) {
  const validate = yield select(getValidate);
  if (!validate) return;

  const { email } = action.payload;
  const error = yield call(validateForm, { email });

  yield put(formValidated({ error }));
};

const submitEmailSignup = function* submitEmailSignup() {
  const email = yield select(getEmail);
  const error = yield call(validateForm, { email });

  yield put(formValidated({ error }));

  if (error) return;

  yield put(emailSubmitStarted());
  const response = yield call(api.submitEmailSignup, { email });
  const { ok } = yield call(transmuter.submitEmailSignup.fromServer, response);

  yield put(emailSubmitCompleted({ ok }));
};

function* homeSaga() {
  yield debounce(DEBOUNCE_MILISECONDS, FORM_CHANGED, onFormChanged);
  yield takeLatest(FORM_SUBMITTED, submitEmailSignup);
}

export default homeSaga;
