import forOwn from 'lodash/forOwn';

export const setCookie = function setCookie(cookies) {
  forOwn(cookies, (v, k) => { document.cookie = `${k}=${v};Path=/`; });
};

export const cookieToObject = function cookieToObject(cookieString = document.cookie) {
  if (!cookieString) return {};

  const parseValue = (val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  };

  const items = cookieString.split(';');
  const cookieObject = items.reduce((acc, item) => {
    const obj = acc;
    const [k, v] = item.split('=');
    obj[k.trim()] = v ? parseValue(v) : true;
    return obj;
  }, {});

  return cookieObject;
};
