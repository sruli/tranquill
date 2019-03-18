const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const { OK, MOVED_PERMANENTLY } = require('http-status');
const { devEnv } = require('./utils/envUtils');

const app = express();

app.set('trust proxy', true);

app.use(helmet.hsts({ maxAge: 31536000, preload: true, setIf: req => req.secure }));

app.use(morgan('combined'));

// For Kubernetes health check
app.get('/healthy', (req, res) => {
  res.status(OK).end();
});

app.use((req, res, next) => {
  if (!devEnv() && req.protocol === 'http') {
    const host = process.env.CLIENT_HOST || 'tranquillapp.com';
    return res.redirect(MOVED_PERMANENTLY, `https://${host}${req.originalUrl}`);
  }
  return next();
});

app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.xssFilter());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    connectSrc: ["'self'", process.env.REACT_APP_API_URL],
  },
}));

app.use(express.static(path.join(__dirname, '../build'), {
  setHeaders: (res, filePath) => {
    if (/build\/static\/(css|js|media)/.test(filePath)) {
      res.set('Cache-Control', 'max-age=2592000');
    } else {
      res.set('Cache-Control', 'no-cache');
    }
  },
}));

app.use((req, res) => {
  res.status(OK).sendFile(path.join(__dirname, '../build/index.html'), {
    headers: { 'Cache-Control': 'co-cache' },
  });
});

app.listen(process.env.CLIENT_PORT || 3000);

module.exports = app;
