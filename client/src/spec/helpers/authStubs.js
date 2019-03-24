import { setCookie } from '../../utilities/cookieUtils';

export const stubAuth = function stubAuth() {
  setCookie({ authenticated: true });
};

export const unstubAuth = function unstubAuth() {
  setCookie({ authenticated: false });
};
