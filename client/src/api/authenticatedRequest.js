import { call, put } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { UNAUTHORIZED } from 'http-status';
import { SCENE_PATH as signInPath } from '../scenes/sign-in';
import { setCookie } from '../utils/cookieUtils';

export default function* authenticatedRequest({ request, requestArgs = [], callback }) {
  const response = yield call(request, ...requestArgs);
  const { status } = response;

  if (status === UNAUTHORIZED) {
    setCookie({ authenticated: false });
    yield put(push(signInPath));
    return;
  }

  if (callback) {
    yield* callback(response);
  }
}
