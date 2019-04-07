const proxyquire = require('proxyquire');

const stubMiddleware = function stubMiddleware(stubObj) {
  const app = proxyquire('../../src/app', {
    './routes': proxyquire('../../src/routes', {
      './v1': proxyquire('../../src/routes/v1', {
        ...stubObj,
      }),
    }),
  });

  return app;
};

const ensureAuthenticationStub = function ensureAuthenticationStub(user) {
  return (req, res, next) => {
    res.locals.userId = user.id;
    return next();
  };
};

const defaultMiddlewareFunc = (req, res, next) => next();

module.exports = {
  stubMiddleware,
  ensureAuthenticationStub,
  defaultMiddlewareFunc,
};
