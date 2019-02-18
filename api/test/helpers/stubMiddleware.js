const proxyquire = require('proxyquire');

const defaultMiddlewareFunc = (req, res, next) => next();

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

module.exports = { stubMiddleware, defaultMiddlewareFunc };
