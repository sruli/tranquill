const parseCookie = function parseCookie(cookie) {
  if (!cookie) return {};

  const items = cookie.split(';');
  const cookieObject = items.reduce((acc, item) => {
    const obj = acc;
    const [k, v] = item.split('=');
    obj[k.trim()] = v || true;
    return obj;
  }, {});

  return cookieObject;
};

module.exports = parseCookie;
